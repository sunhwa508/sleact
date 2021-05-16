import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM, IChat } from '@typings/db';
import React, { useCallback, forwardRef, RefObject, MutableRefObject } from 'react';

const ChatList = () => {
  return (
    <ChatZone>
      <Section>chatList</Section>
    </ChatZone>
  );
};

export default ChatList;
