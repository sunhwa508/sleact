import {
  Header,
  RightMenu,
  ProfileImg,
  WorkspaceWrapper,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  Channels,
  Chats,
  MenuScroll,
} from '@layouts/Workspace/styles';
import React, { useCallback, FC } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { Redirect } from 'react-router';
import gravatar from 'gravatar';
// FC 안에 children 들어있다
const Workspace: FC = ({ children }) => {
  const { data, error, revalidate, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 2000, //2초동안은 캐시된것 사용
  });

  // const { data, error, revalidate, mutate } = useSWR('http://localhost:3095/api/users#123', fetcher, {
  //   dedupingInterval: 2000, //2초동안은 캐시된것 사용
  // })
  //요청은 같은 곳으로 되나 따로 저장된다

  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      });
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        test
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.nickname, { s: '28px', d: 'monsterid' })} alt={data.nickname} />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspace>test</Workspace>
        {/*<Channels>*/}
        {/*  <WorkspaceName>Sleact</WorkspaceName>*/}
        {/*  <MenuScroll>Menu</MenuScroll>*/}
        {/*</Channels>*/}
        <Chats>Chats</Chats>
      </WorkspaceWrapper>
      {children}
    </div>
  );
};

export default Workspace;
