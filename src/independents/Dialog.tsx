import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DialogOuter = styled.div`
background-color: #0003;
height: 100vh;
left: 0;
position: fixed;
top: 0;
width: 100vw;
`;

const DialogInner = styled.article`
background-color: #fff;
border-radius: 0.2em;
height: calc(100% - 2rem);
left: 1rem;
overflow: auto;
position: absolute;
top: 1rem;
width: calc(100% - 2rem);
`;

const Dialog: React.FC = ({ children }) => {
  return (
    <DialogOuter>
      <DialogInner>
        {children}
      </DialogInner>
    </DialogOuter>
  );
};

export default Dialog;

export const DialogTitle = styled.h1.attrs({
  className: 'container',
})`
  height: 2em;
  line-height: 2em;
`;

export const DialogHeading = styled.h2.attrs({
  className: 'container',
})`
  font-size: 0.8em;
  height: 2em;
  line-height: 2em;
  margin-top: 1em;
`;

export const DialogLink = styled(Link).attrs({
  className: 'container Dialog-item',
})`
  &:active {
    background-color: #f0f9ff;
  }
`;

const DialogInputOuter = styled.label.attrs({
  className: 'container Dialog-item',
})`
  color: #666;
  height: auto;
`;

const DialogInputLine = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DialogInputLabel = styled.span`
  margin-right: 0.5em;
`;

const DialogInnerInput = styled.input`
  border-style: none;
  text-align: right;
  width: 100%;
`;

const DialogInputDescription = styled.div`
  font-size: 0.8em;
  font-style: oblique;
  height: 1.2em;
  line-height: 1.2em;
`;

interface DialogInputProp extends React.ComponentPropsWithRef<'input'> {
  description?: string;
  label: string;
};

export const DialogInput: React.FC<DialogInputProp> = (props) => {
  const { description, label, ...inputProps } = props;
  return (
    <DialogInputOuter>
      <DialogInputLine>
        <DialogInputLabel>{label}</DialogInputLabel>
        <DialogInnerInput {...inputProps} />
      </DialogInputLine>
      {description && (
        <DialogInputDescription>{description}</DialogInputDescription>
      )}
    </DialogInputOuter>
  );
};
