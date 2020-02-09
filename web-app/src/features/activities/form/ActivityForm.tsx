import React, { useState } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react';
import IActivity from '../../../app/models/activity';
import {v4 as uuid} from 'uuid';

interface IProps {
    activity: IActivity | null;
    setEditMode: (editMode: boolean) => void;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    setSelectedActivity: (activity: IActivity | null) => void;
}

const ActivityForm: React.FC<IProps> = ({activity, setEditMode, createActivity, editActivity, setSelectedActivity}) => {

    const initializeForm = () => {
        if (activity) {
            return activity;
        }else {
            return {
                id: '',
                title: '',
                description: '',
                category: '',
                date: '',
                city: '',
                venue: ''
            };
        }
    };

    const [Activity, setActivity] = useState<IActivity>(initializeForm);

    const handleSubmit = () => {
        let newActivity: IActivity = {...Activity};

        if (newActivity.id.length === 0) {
            newActivity.id = uuid();
            createActivity(newActivity);
        }else {
            editActivity(newActivity);
        }
        setEditMode(false);
        setSelectedActivity(newActivity);
    };

    const handleInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...Activity, [name]: value});
    };

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input onChange={handleInputChange} placeholder='Title' name='title' value={activity?.title} />
                <Form.TextArea onChange={handleInputChange} rows={2} placeholder='Description' name='description' value={activity?.description} />
                <Form.Input onChange={handleInputChange} placeholder='Category' name='category' value={activity?.category} />
                <Form.Input onChange={handleInputChange} type='datetime-local' placeholder='Date' name='date' value={activity?.date} />
                <Form.Input onChange={handleInputChange} placeholder='City' name='city' value={activity?.city} />
                <Form.Input onChange={handleInputChange} placeholder='Venue' name='venue' value={activity?.venue} />
                <Button floated='right' positive content='Submit' />
                <Button floated='right' content='Cancel' onClick={ () => setEditMode(false) } />
            </Form>
        </Segment>
    )
}

export default ActivityForm;
