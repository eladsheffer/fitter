import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export default function UserCard({ user }) {
    const DEFAULT_USER_IMG = '/icons/user.png';
    let userImg = user.profile_picture ? user.profile_picture : DEFAULT_USER_IMG;
    return (
        <div style={{ margin: "5%" }}>
            <Card border="secondary">
                <Link to={`/users/${user.id}`} style={{ textDecoration: "none" }}>
                    <Card.Img variant="top" src={userImg} style={{width:"243px", height: "250px"}} />
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
