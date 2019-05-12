import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { HtmlComponent, HtmlProps } from '../misc';
import './Dialog.scss';

const Dialog: React.FC = ({ children }) => {
  return (
    <div className="Dialog-outer">
      <div className="Dialog">
        {children}
      </div>
    </div>
  );
};

export default Dialog;

export const DialogTitle: HtmlComponent<'h1'> = (props) => {
  return (
    <h1
      {...props}
      className="container DialogTitle"
    />
  );
}

export const DialogHeading: HtmlComponent<'h2'> = (props) => (
  <h2
    {...props}
    className="container DialogHeading"
  />
);

export const DialogLink: React.FC<LinkProps> = (props) => (
  <Link
    {...props}
    className="container Dialog-item DialogLink"
  />
);

interface DialogInputProp extends HtmlProps<'input'> {
  description?: string;
  label: string;
};

export const DialogInput: React.FC<DialogInputProp> = (props) => {
  const { description, label, ...inputProps } = props;
  return (
    <label className="container Dialog-item DialogInput">
      <span className="DialogInputLabel">{label}</span>
      <input {...inputProps} className="DialogInnerInput" />
      {description && (
        <div className="DialogInputDescription">{description}</div>
      )}
    </label>
  );
};
