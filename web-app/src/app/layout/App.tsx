import React, { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react';
import IActivity from "../models/activity";
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

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
    setSubmitting(true);
    agent.activities.create(activity).then(() => {
      setActivities([...activities, activity]);
    })
    .then(() => setSubmitting(false));
  };

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.activities.update(activity).then(() => {
      const actIndex = activities.findIndex(a => a.id === activity.id);
      let act = activities.find(a => a.id === activity.id);
  
      if (actIndex >= 0) {
        act = {...activity};
        activities[actIndex] = act;
      }
      setActivities(activities);
      setSelectedActivity(act!);
      setEditMode(false);
    })
    .then(() => setSubmitting(false));
  };

  const handleDelelteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.activities.delete(id).then(() => {
      setActivities(activities.filter(a => a.id !== id));
    })
    .then(() => setSubmitting(false));
  }

  useEffect(() => {
    //axios.get<IActivity[]>('https://localhost:5001/api/activities')
    agent.activities.list()
      .then(response => {
        let activities: IActivity[] = [];

        response.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        });
        setActivities(activities);
      })
      .then(() => setLoading(false))
      .catch(error => console.log(error));
  }, []);

  if (loading) return <LoadingComponent content='Loading activities...' />

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
          deleteActivity={handleDelelteActivity}
          submitting={submitting}
          target={target} />
      </Container>
    </Fragment>
  );
}

export default App;
