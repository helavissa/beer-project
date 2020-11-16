import React from "react";
import {Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle} from "reactstrap";

function Beer({beer}){
    return (
        <Card data-testid="card">
            <CardImg src={beer.imageUrl} alt={beer.name} />
            <CardBody>
                <CardTitle tag="h5">{beer.name}</CardTitle>
                <CardSubtitle tag="h6">{beer.abv}% ABV</CardSubtitle>
                <CardText>{beer.description}</CardText>
            </CardBody>
        </Card>
    );
}

class BeerList extends React.Component{

    constructor(props) {
        super(props);
    }

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