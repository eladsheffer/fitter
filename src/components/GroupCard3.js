import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Image, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { addGroup, removeGroup, updateGroup } from '../features/groups';
import { showModal, renderModalType, setGroupId } from '../features/modal';
import { postData } from '../features/apiService';


const GroupCard3 = (props) => {
    const group = props.group;
    const render = props.render;
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const activeUser = useSelector((state) => state.user.value);
    
    const [isMember, setIsMember] = useState(activeUser && group ? group.members.includes(activeUser.id): false);
    const [isAdmin, setIsAdmin] = useState(activeUser && group ? group.admin === activeUser.id : false);

    const defaultGroupImage = '/icons/group.png';
    const profile_picture = group.profile_picture ? group.profile_picture : defaultGroupImage;
    const memberIcon = '/icons/success.png';
    const adminIcon = '/icons/admin.png';

    const joinGroup = async () => {
        if (!activeUser)
            navigate('/login');

        let url = serverUrl + `groups/${group.id}/add_user/`;
        let data = {
            user_id: activeUser.id
        };
        let response = await postData(url, data);
        
        if (response) {
            dispatch(updateGroup());
            if (!render) {
                setIsMember(true);
            }
        } else {
            console.error('Error joining group:', response);
        }
    };

    const leaveGroup = async () => {
        let url = serverUrl + `groups/${group.id}/remove_user/`;
        let data = {
            user_id: activeUser.id
        };
        let response = await postData(url, data);
        if (response) {
            dispatch(updateGroup());
            if (!render) {
                setIsMember(false);
                setIsAdmin(false);
            }
        } else {
            console.error('Error leaving group:', response);
        }
    };

    const editGroup = () => {
        console.log('Edit group:', group);
        navigate(`/edit-group/${group.id}`);
    };

    const createEvent = () => {
        //navigate(`/new-event/${group.id}`);
        dispatch(renderModalType({ type: 'Event' }));
        dispatch(setGroupId({groupId: group.id}));
        dispatch(showModal());
    };

    const login = () => {
        navigate('/login');
    };

    return (
        <div>
            <hr />
            <Row>
                <Col lg={6} md={6} sm={6} xs="6" style={{ overflow: "hidden" }}>
                    <Link to={`/groups/${group.id}/`}>
                        <Image
                            src={profile_picture}
                            alt="Group thumbnail"
                            style={{ width: "200px", height: "150px" }}
                        />
                    </Link>
                </Col>
               


                <Col lg={6} md={6} sm={6} xs="6" style={{textWrap: "wrap", whiteSpace: "wrap", textOverflow: "ellipsis"}}>
                    <Row>
                        <Link to={`/groups/${group.id}/`} style={{textDecoration: "none"}}>
                            <h5>{group.name}</h5>
                        </Link>
                       
                            <Col>
                                <h6>{group.location}</h6>
                                <h6>{`Gender: ${group.gender}`}</h6>
                    <h6>{`Ages: ${group.min_age ? group.min_age : "0"} - ${group.max_age ? group.max_age : "120"}`}</h6>
                            </Col>
                    </Row>
                   
                </Col>
            </Row>
            <Row>
                <Col xs={8}>
                    <p>{group.description}</p>
                </Col>
            </Row>

            <Row>
                        <Col>
                            <h6>Preferred Sports: |  
                            {group.preferred_sports.map((sport) => (
                                ` ${sport} | `
                            ))} </h6>
                        </Col>

                    </Row>
                    
            <Row className="justify-between gap-5" style={{ color: "#43a047" }}>
                <Col>
                    
                    <h6>{`${group.members.length} Members`}</h6>
                </Col>
            </Row>

            <Row className="justify-between gap-5">
                <Col>
                    {activeUser === null ? (
                        <Button variant="outline-warning" onClick={login}>Login</Button>
                    ) : isAdmin ? (
                        <>
                            <Button variant="outline-primary" onClick={editGroup}>Edit Group</Button>
                            <Button variant="outline-danger" onClick={createEvent}>Create New Event</Button>
                        </>
                    ) : isMember ? (
                        <Button variant="outline-info" onClick={leaveGroup}>Leave</Button>
                    ) : (
                        <Button variant="outline-warning" onClick={()=>joinGroup()}>Join</Button>
                    )}              </Col>
            </Row>
            
            {isMember &&
                <Row>
                    <Col xs="auto" style={{ paddingRight: '0', display: 'flex', alignItems: 'center' }}>
                        <Image src={memberIcon} alt="Member icon" width={20} height={20} />
                    </Col>
                    <Col className="text-start" xs="auto" style={{ paddingLeft: '0', display: 'flex', alignItems: 'center' }}>
                        <h5 style={{ color: 'green', marginLeft: '5px', marginTop: '6px' }}>Member</h5>
                    </Col>
                    {isAdmin &&
                    <>
                        <Col xs="auto" style={{ paddingLeft: '0', display: 'flex', alignItems: 'center' }}>
                            <Image src={adminIcon} alt="Admin icon" width={30} height={30} />
                        </Col> 
                        <Col className="text-start" xs="auto" style={{ paddingLeft: '0', display: 'flex', alignItems: 'center' }}>
                        <h5 style={{ color: 'blue', marginLeft: '5px', marginTop: '6px' }}>Admin</h5>
                    </Col>
                    </>
                    }
                </Row>
            }

        </div>
    );
}

export default GroupCard3;