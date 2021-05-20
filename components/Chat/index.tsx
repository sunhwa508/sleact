import React, { VFC, memo, useMemo } from 'react';
import { IDM } from '@typings/db';
import gravatar from 'gravatar';
import { ChatWrapper } from '@components/Chat/styles';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';

interface Props {
  data: IDM;
}
const Chat: VFC<Props> = ({ data }) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const user = data.Sender;
  // @[제로초1](7)
  //g 모두 찾겠다 // 하나만 찾겠다
  // \ 특수기호를 무력화 하겠다. d = 숫자, + = 1개 이상 , ? 는 0 or 1, * = 0개 이상 +? 최대한 조금 찾겠다.
  // + = 최대한 많이, +? = 최대한 조금
  const result = useMemo(
    () =>
      regexifyString({
        input: data.content,
        pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
        decorator(match, index) {
          const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
          if (arr) {
            return (
              <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                @{arr[1]}
              </Link>
            );
          }
          return <br key={index} />;
        },
      }),
    [data.content],
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '28px', d: 'monsterid' })} alt={user.email} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};
export default memo(Chat);
