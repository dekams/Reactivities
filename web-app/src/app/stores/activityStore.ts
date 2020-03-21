import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import IActivity from '../models/activity';
import agent from '../api/agent';

configure({enforceActions: 'always'});

class ActivityStore {
  @observable activityRegistry = new Map<string, IActivity>();
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.activities.list();
      runInAction('Loading Activities', () => {
          activities.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          this.activityRegistry.set(activity.id, activity); 
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      console.log(error);
      runInAction('Load Activities Error',() => {
        this.loadingInitial = false;
      });
    }
  };

  @action createActivity = async (activity:IActivity) => {
    this.submitting = true;
    try {
      await agent.activities.create(activity);
      runInAction('Creating Activities', () => {
        this.activityRegistry.set(activity.id, activity); 
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction('Create Activities Error', () => {
        this.submitting = false;
      });
    }
  };

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  }

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.activities.update(activity);
      runInAction('Editing Activities', () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction('Edit Activities Error', () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    
    try {
      this.target = event.currentTarget.name;
      await agent.activities.delete(id);
      runInAction('Deleting Activities', () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      });
    } catch (error) {
      runInAction('Delete Activities Error', () => {
        this.submitting = false;
        this.target = '';
      });
      console.log(error);
    }
  }

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  @action cancelFormOpen = () => {
    this.editMode = false;
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());
