import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { render, screen } from '@testing-library/react';
import App from '../app';
import { data } from './mockData';
import { act } from "react-dom/test-utils";
import Main from "../components/MainComponent";

let container = null;

describe('App', () => {

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
        render(<App />, container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    test('renders search', () => {
        const inputElement = screen.getByPlaceholderText('Search beers by name or description')
        const buttonElement = screen.getByText('Submit');
        expect(inputElement).toBeInTheDocument();
        expect(buttonElement).toBeInTheDocument();
    });

    test('renders pagination', () => {
        const element1 = screen.getByText('«');
        const element2 = screen.getByText('»');
        expect(element1).toBeInTheDocument();
        expect(element2).toBeInTheDocument();
    });

    test("renders beers", async () => {
        const fakeData = data;
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(fakeData)
            })
        );

        // Use the asynchronous version of act to apply resolved promises
        await act(async () => {
            render(<Main />, container);
        });

        const element = screen.getAllByTestId('card');
        expect(element.length).toEqual(2);

        const elementErr = screen.queryByText('beers-load-error');
        expect(elementErr).toBeNull();

        // remove the mock to ensure tests are completely isolated
        global.fetch.mockRestore();
    });

    test("renders beers load error", async () => {
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                ok: false
            })
        );

        // Use the asynchronous version of act to apply resolved promises
        await act(async () => {
            render(<Main />, container);
        });

        const element = screen.getByTestId('beers-load-error');
        expect(element).toBeInTheDocument();

        // remove the mock to ensure tests are completely isolated
        global.fetch.mockRestore();
    });

});