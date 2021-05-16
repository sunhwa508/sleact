import React from 'react';
import gravatar from 'gravatar';
import { Container, Header } from '@pages/Channel/styles';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);

  if (!userData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '28px', d: 'monsterid' })} alt={userData.email} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat={''} />
    </Container>
  );
};

export default DirectMessage;
