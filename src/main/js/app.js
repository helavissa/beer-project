import React from "react";
import Pagination from "react-js-pagination";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle,
    Button, Form, FormGroup, Input} from 'reactstrap';
import { baseUrl, beersUrl } from './constants';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            beers: [],
            activePage: 1,
            itemsCountPerPage: 10,
            totalItemsCount: 0,
            searchBeer: ""
        };
        this.fetchBeers = this.fetchBeers.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
            .catch(error => console.log('Error loading beers: ' + error.message));
    }

    handleSubmit(event) {
        event.preventDefault();
        this.fetchBeers();
    }

    handleChange(event) {
        this.setState({
            ...this.state,
            searchBeer: event.target.value
        });
    }

    componentDidMount() {
        this.fetchBeers();
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Input value={this.state.searchBeer}
                               onChange={this.handleChange}
                               name="searchBeer"
                               id="searchBeer"
                               placeholder="Search beers by name or description" />
                    </FormGroup>
                    <Button type="submit">Submit</Button>
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
                <BeerList beers={this.state.beers}/>
            </div>
        )
    }
}

class BeerList extends React.Component{
    render() {
        // display (max) 5 beers in a row
        const beers1 = this.props.beers.slice(0, 5).map((beer) => (
            <Beer key={beer.id} beer={beer}/>
        ));
        const beers2 = this.props.beers.slice(5).map((beer) => (
            <Beer key={beer.id} beer={beer}/>
        ));
        return (
            <div>
                <div className="card-deck">
                    {beers1}
                </div>
                <div className="card-deck">
                    {beers2}
                </div>
            </div>
        )
    }
}

class Beer extends React.Component{
    render() {
        return (
            <Card>
                <CardImg src={this.props.beer.imageUrl} alt={this.props.beer.name} />
                <CardBody>
                    <CardTitle tag="h5">{this.props.beer.name}</CardTitle>
                    <CardSubtitle tag="h6">{this.props.beer.abv}% ABV</CardSubtitle>
                    <CardText>{this.props.beer.description}</CardText>
                </CardBody>
            </Card>
        )
    }
}

export default App;
