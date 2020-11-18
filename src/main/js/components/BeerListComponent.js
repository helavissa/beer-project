import React from 'react';
import {Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import {baseUrl, toggleUserBeerUrl, userFavoutiesUrl} from '../resources/constants';

library.add(faHeart);

class Beer extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            isFavourite: this.props.isFavourite
        };
        this.toggleUserBeer = this.toggleUserBeer.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevState.isFavourite !== this.props.isFavourite){
            this.setState({
                ...this.state,
                isFavourite: this.props.isFavourite
            })
        }
    }

    toggleUserBeer(){
        const url = `${baseUrl}` +
            toggleUserBeerUrl(this.props.userGoogleId) +
            `?beerId=${this.props.beer.id}`;

        fetch(url, { method: 'POST'})
            .then(response => {
                    if (response.ok) {
                        this.setState({
                            ...this.state,
                            isFavourite: !this.state.isFavourite
                        });
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
            .catch(error => {
                console.log('Error setting favourite beer: ' + error);
            });
    }

    render() {
        return(
            <div>
                <Card data-testid="card">
                    {this.props.userGoogleId ?
                        <FontAwesomeIcon icon="heart"
                                         className={"fa-lg favourite-icon " +
                                         (this.state.isFavourite ? "active" : "")}
                                         onClick={() => this.toggleUserBeer()
                                         }/> : <div />
                    }
                    <CardImg src={this.props.beer.imageUrl} alt={this.props.beer.name} />
                    <CardBody>
                        <CardTitle tag="h5">{this.props.beer.name}</CardTitle>
                        <CardSubtitle tag="h6">{this.props.beer.abv}% ABV</CardSubtitle>
                        <CardText>{this.props.beer.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }

}

class BeerList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            userGoogleId : props.userGoogleId,
            favourites : []
        };
    }

    componentDidMount() {
        this.getFavourites();
    }

    componentWillReceiveProps(nextProps, nextContent) {
        this.setState({
            ...this.state,
            userGoogleId: nextProps.userGoogleId
        }, function(){
            this.getFavourites()
        })
    }

    getFavourites(){
        const url = `${baseUrl}` + userFavoutiesUrl(this.state.userGoogleId);

        fetch(url)
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
            .then(responseJson => {
                return this.setState({
                    ...this.state,
                    favourites: responseJson
                });
            })
            .catch(error => {
                console.log('Error setting favourite beer: ' + error);
            });
    }

    render() {
        // display (max) 5 beers in a row
        const beers1 = this.props.beers.slice(0, 5).map((beer) => (
            <Beer key={beer.id}
                  beer={beer}
                  userGoogleId={this.props.userGoogleId}
                  isFavourite={this.state.favourites ? this.state.favourites.includes(beer.id) : false}/>
        ));
        const beers2 = this.props.beers.slice(5).map((beer) => (
            <Beer key={beer.id}
                  beer={beer}
                  userGoogleId={this.props.userGoogleId}
                  isFavourite={this.state.favourites ? this.state.favourites.includes(beer.id) : false}/>
        ));
        return (
                /*
                *  Here we are initially returning an empty component, to cause to re-render when async method fills this.state.favourites
                * */
                this.state.favourites.length === 0
                && this.props.showFavourites
                && this.props.userGoogleId !== 0 ?
                    <div/> :
                    <div>
                        <div className="card-deck" data-testid="card-deck">
                            {beers1}
                        </div>
                        <div className="card-deck" data-testid="card-deck">
                            {beers2}
                        </div>
                    </div>
        );
    }
}

export default BeerList;