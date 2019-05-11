import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { HtmlComponent } from '../misc';

const Dialog: React.FC = ({ children }) => {
  return (
    <div style={{
      backgroundColor: '#0003',
      height: '100vh',
      left: '0',
      position: 'fixed',
      top: '0',
      width: '100vw',
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '0.2em',
        height: 'calc(100% - 2rem)',
        left: '1rem',
        overflow: 'auto',
        position: 'absolute',
        top: '1rem',
        width: 'calc(100% - 2rem)',
      }}>
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
      className="container"
      style={{
        height: '2em',
        lineHeight: '2em',
      }}
    />
  );
}

export const DialogHeading: HtmlComponent<'h2'> = (props) => (
  <h2
    {...props}
    className="container"
    style={{
      fontSize: '0.8em',
      height: '2em',
      lineHeight: '2em',
      marginTop: '1em',
    }}
  />
);

export const DialogLink: React.FC<LinkProps> = (props) => (
  <Link
    {...props}
    className="container Dialog-item"
    style={{
      backgroundColor: '#f0f9ff',
    }}
  />
);

interface DialogInputProp extends HtmlComponent<'input'> {
  description?: string;
  label: string;
};

export const DialogInput: React.FC<DialogInputProp> = (props) => {
  const { description, label, ...inputProps } = props;
  return (
    <label
      className="container Dialog-item"
      style={{
        color: '#666',
        height: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            marginRight: '0.5em',
          }}
        >
          {label}
        </span>
        <input
          {...inputProps}
          style={{
            borderStyle: 'none',
            textAlign: 'right',
            width: '100%',
          }}
        />
      </div>
      {description && (
        <div
          style={{
            fontSize: '0.8em',
            fontStyle: 'oblique',
            height: '1.2em',
            lineHeight: '1.2em',
          }}
        >{description}</div>
      )}
    </label>
  );
};
