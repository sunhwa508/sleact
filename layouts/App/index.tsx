import React, { FC } from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router';

//코드 스플리팅
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const WorkSpace = loadable(() => import('@layouts/Workspace'));

const Index: FC = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/:workspace" component={WorkSpace} />
    </Switch>
  );
};
export default Index;

//jotai, zustand, recoil
