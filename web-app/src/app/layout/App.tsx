import React, { useState, useEffect, Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import axios from "axios";
import IActivity from "../models/activity";
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleSelectedActivity = (id: string) => {
    const activity = activities.filter(a => a.id === id)[0];
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity]);
  };

  const handleEditActivity = (activity: IActivity) => {
    const actIndex = activities.findIndex(a => a.id === activity.id);
    let act = activities.find(a => a.id === activity.id);

    if (actIndex >= 0) {
      act = {...activity};
      activities[actIndex] = act;
    }
    setActivities(activities);
    setEditMode(false);
    setSelectedActivity(act!);
  };

  const handleDelelteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  }

  useEffect(() => {
    axios.get<IActivity[]>('https://localhost:5001/api/activities')
      .then(response => {
        let activities: IActivity[] = [];

        response.data.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        });
        setActivities(activities);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard activities={activities}
          selectActivity={handleSelectedActivity}
          selectedActivity={selectedActivity!}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDelelteActivity} />
      </Container>
    </Fragment>
  );
}

export default App;
