import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UserCard() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Card style={{ width: '18rem' }}>
                <Card.Img
                    variant="top"
                    src="https://res.cloudinary.com/djud4xysp/image/upload/v1718562435/users_profile_pictures/pikachu_v53jdq.png"
                    style={{ objectFit: 'cover', height: '200px' }}
                />
                <Card.Body>
                    <Card.Title>John Doe</Card.Title>
                    <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of the card's content.
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}
