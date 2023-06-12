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
    expect(component.getByText(/Coordinates \(2, 2\)/)).toBeInTheDocument();
    expect(component.getByText(/You moved 0 times/)).toBeInTheDocument();
  });

  it('moves correctly to the right and updates steps and coordinates', () => {
    fireEvent.click(component.getByText('RIGHT'));
    expect(component.getByText(/Coordinates \(3, 2\)/)).toBeInTheDocument();
    expect(component.getByText(/You moved 1 time/)).toBeInTheDocument();
  });

  it('does not move when hitting the boundary', () => {
    fireEvent.click(component.getByText('UP'));
    fireEvent.click(component.getByText('UP'));
    expect(component.getByText(/Coordinates \(2, 1\)/)).toBeInTheDocument();
    expect(component.getByText(/You moved 1 time/)).toBeInTheDocument();
  });

  it('resets the game correctly', () => {
    fireEvent.click(component.getByText('RIGHT'));
    fireEvent.click(component.getByText('reset'));
    expect(component.getByText(/Coordinates \(2, 2\)/)).toBeInTheDocument();
    expect(component.getByText(/You moved 0 times/)).toBeInTheDocument();
  });
});


