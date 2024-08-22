
import { Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function UserCard({ user }) {
    const DEFAULT_USER_IMG = '/icons/user.png';
    let userImg = user.profile_picture ? user.profile_picture : DEFAULT_USER_IMG;
    return (
        <div   className="profile-container">
            <Link to={`/users/${user.id}`} style={{ textDecoration: "none" }}>
                <Row>
                    <Col>
                        <Image className='profile-image' src={userImg} roundedCircle/>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-container">

                        <h5>{user.first_name} {user.last_name}</h5>

                    </Col>
                </Row>
            </Link>
        </div>
    );
} 
