import React from 'react';
import Pagination from 'react-js-pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Form, FormGroup, Input} from 'reactstrap';
import { baseUrl, beersUrl, googleClientId } from '../resources/constants';
import BeerList from './BeerListComponent';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            beers: [],
            activePage: 1,
            itemsCountPerPage: 10,
            totalItemsCount: 0,
            searchBeer: '',
            errorLoadingBeers: false,
            userFirstName: '',
            userGoogleId: 0,
            showFavourites: false
        };
        this.fetchBeers = this.fetchBeers.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
        this.handleGoogleLogout = this.handleGoogleLogout.bind(this);
        this.toggleFavourites = this.toggleFavourites.bind(this);
    }

    toggleFavourites(){
        this.setState({
            ...this.state,
            showFavourites: !this.state.showFavourites,
            activePage: 1
        }, function(){
            this.fetchBeers();
        })
    }

    handlePageChange(pageNumber) {
        this.setState({
                ...this.state,
                activePage: pageNumber},

            function () {
                this.fetchBeers();
            });
    }

    getBeersUrl(){
        return `${baseUrl}${beersUrl}?`+
            `page=${this.state.activePage-1}&` +
            `size=${this.state.itemsCountPerPage}&` +
            (this.state.searchBeer ? `searchStr=${this.state.searchBeer}&` : ``) +
            (this.state.showFavourites && this.state.userGoogleId !==0 ? `userId=${this.state.userGoogleId}&` : ``) +
            `sort=id,asc`
    }

    fetchBeers() {
        fetch(this.getBeersUrl())
            .then(response => {
                    if (response.ok) {
                        return response;
                    } else {
                        let error = new Error('Error ' + response.status + ': ' + response.statusText);
                        error.response = response;
                        throw error;
                    }
                },
                error => {
                    throw new Error(error.message);
                })
            .then(response => response.json())
            .then(beersJson => {
                this.setState({
                    ...this.state,
                    beers: beersJson.content,
                    totalItemsCount: beersJson.totalElements
                });
            })
            .catch(error => {
                console.log('Error loading beers: ' + error);
                this.setState({
                    ...this.state,
                    errorLoadingBeers: true
                })
            });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.fetchBeers();
    }

    handleChange(event) {
        this.setState({
            ...this.state,
            activePage: 1,
            searchBeer: event.target.value
        });
    }

    componentDidMount() {
        this.fetchBeers();
    }

    handleGoogleLogin(response){
        this.setState({
            ...this.state,
            userFirstName: response.profileObj.givenName,
            userGoogleId: response.profileObj.googleId
        })
    }

    handleGoogleLogout(){
        this.setState({
            ...this.state,
            userFirstName: '',
            userGoogleId: 0,
            showFavourites: false
        }, function(){
            this.fetchBeers();
        })
    }

    render() {
        return (
            <div>
                <div className="header">
                    {
                        this.state.userFirstName ?
                            <div>
                                <GoogleLogout
                                    clientId={googleClientId}
                                    buttonText="Logout"
                                    onLogoutSuccess={this.handleGoogleLogout}
                                />
                                <h2>Hey, {this.state.userFirstName}</h2>
                            </div>
                            :
                            <GoogleLogin
                                clientId={googleClientId}
                                buttonText="Login"
                                onSuccess={this.handleGoogleLogin}
                                onFailure={this.handleGoogleLogin}
                                cookiePolicy={'single_host_origin'}
                                isSignedIn={true}
                            />
                    }
                </div>

                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Input value={this.state.searchBeer}
                               onChange={this.handleChange}
                               name="searchBeer"
                               id="searchBeer"
                               placeholder="Search beers by name or description" />

                    </FormGroup>

                    <Button type="submit">Submit</Button>

                    {
                        this.state.userGoogleId ?
                            <FormGroup className="margin-left-20 margin-top-10">
                                <Input type="checkbox"
                                       onClick={this.toggleFavourites}
                                       defaultChecked={this.state.showFavourites}
                                /> Show Favourites
                            </FormGroup> : <div/>
                    }
                </Form>
                <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={this.state.itemsCountPerPage}
                    totalItemsCount={this.state.totalItemsCount}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange.bind(this)}
                    itemClass="page-item"
                    linkClass="page-link"
                />

                <BeerList beers={this.state.beers}
                          userGoogleId={this.state.userGoogleId}
                          showFavourites={this.state.showFavourites}
                />

                {this.state.errorLoadingBeers ?
                    <div className="alert alert-danger" data-testid="beers-load-error">
                        Oops...There seems to be an error loading beers!
                    </div>
                    : <div />
                }

            </div>
        )
    }
}

export default Main;
