import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppClass, { initialState } from './AppClass';

describe('<AppClass />', () => {
  let component;

  beforeEach(() => {
    component = render(<AppClass />);
  });

  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });

  it('shows the correct initial coordinates and steps', () => {
    expect(component.getByTestId('coordinates')).toHaveTextContent('Coordinates (2, 2)');
    expect(component.getByTestId('steps')).toHaveTextContent('You moved 0 times');
  });

  it('moves correctly to the right and updates steps and coordinates', () => {
    fireEvent.click(component.getByText('RIGHT'));
    expect(component.getByTestId('coordinates')).toHaveTextContent('Coordinates (3, 2)');
    expect(component.getByTestId('steps')).toHaveTextContent('You moved 1 time');
  });

  it('does not move when hitting the boundary', () => {
    fireEvent.click(component.getByText('UP'));
    fireEvent.click(component.getByText('UP'));
    expect(component.getByTestId('coordinates')).toHaveTextContent('Coordinates (2, 1)');
    expect(component.getByTestId('steps')).toHaveTextContent('You moved 1 time');
  });

  it('resets the game correctly', () => {
    fireEvent.click(component.getByText('RIGHT'));
    fireEvent.click(component.getByText('reset'));
    expect(component.getByTestId('coordinates')).toHaveTextContent('Coordinates (2, 2)');
    expect(component.getByTestId('steps')).toHaveTextContent('You moved 0 times');
  });
});

