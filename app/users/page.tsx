'use client';
import UsersList from '@/components/ClassComponents/UsersList/UsersList';
import withSearchParams from '@/components/routing/withSearchParams';
import UserClient from '@/services/client/common/ClientServices/UserClient';
import React, { Component } from 'react';
// import { UserService } from '@/services/client/common/ClientServices/userservicesClient';
import { Observable } from 'rxjs';

interface UsersPageProps {
  searchParams: URLSearchParams;
}

interface UsersPageState {
  users: Array<{ id: number; username: string; email: string }>;
  isLoading: boolean;
  error: string | null;
}

class UsersPage extends Component<UsersPageProps, UsersPageState> {
  private usersSubscription: any;
  userClient!:UserClient
  constructor(props: UsersPageProps) {
    super(props);
    this.userClient = new UserClient()
    this.state = {
      users: [],
      isLoading: true,
      error: null,
    };
  }

  // Fetch users when the component mounts
  componentDidMount() {
    // this.fetchUsers();
  }

  // Fetch users and subscribe to the observable
  fetchUsers = () => {
    const userId = this.props.searchParams.get('userId');
    this.userClient.getAllUsers().subscribe({
      next: (response) => {
        console.log('User data received:', response);
        if(response.status == 200)
        {
          if (Array.isArray(response.users)) {
            this.setState({
              users: response.users,
              isLoading: false,
            });
          } else {
            this.setState({
              error: 'Invalid data format received.',
              isLoading: false,
            });
          }
        }
        
      },
      error: (err) => {
        console.log('Error fetching users:', err);
        this.setState({
          error: 'Failed to fetch users',
          isLoading: false,
        });
      },
      complete: () => {
        console.log('User fetching completed.');
      }
    });
    
  };

  // Clean up the subscription when the component is unmounted
  componentWillUnmount() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

  render() {
    const { users, isLoading, error } = this.state;
    const userId = this.props.searchParams.get('userId') || 'No User ID';

    return (
      <div>
        <UsersList users={[]}></UsersList>
      </div>
    );
  }
}

export default withSearchParams(UsersPage);

