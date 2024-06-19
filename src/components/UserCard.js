import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export default function UserCard({ user }) {
    const DEFAULT_USER_IMG = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwGsNv23K5shKblMsKePA8o6M2kqBH39PZqA&s';
    return (
        <div style={{ width: "23%", margin: "1%" }}>
            <Card border="secondary">
                <Link to={`/users/${user.id}`} style={{ textDecoration: "none" }}>
                    <Card.Img variant="top" src={DEFAULT_USER_IMG} />
                </Link>
                <Card.Body>
                    <Link to={`/users/${user.id}`} style={{ textDecoration: "none" }}>
                        <Card.Title>{user.first_name} {user.last_name}</Card.Title>
                    </Link>
                </Card.Body>
            </Card>
        </div>
    );
} 
