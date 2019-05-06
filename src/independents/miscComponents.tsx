import { History } from 'history';
import React from 'react';

export const BackLink: React.FC<{
  history: History;
}> = (props) => {
  const { history, ...rest } = props;
  return (
    <span
      {...rest}
      className="link"
      onClick={() => props.history.goBack()}
    />
  );
};
