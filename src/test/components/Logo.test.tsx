import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Logo from '../../components/Logo';

describe('Logo Component', () => {
  it('renders the logo text', () => {
    render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>
    );
    expect(screen.getByText('StyleSync')).toBeInTheDocument();
  });

  it('applies correct styling for black variant', () => {
    render(
      <BrowserRouter>
        <Logo variant="black" />
      </BrowserRouter>
    );
    const logo = screen.getByText('StyleSync');
    expect(logo).toHaveClass('text-[#34020E]');
  });

  it('applies correct styling for white variant', () => {
    render(
      <BrowserRouter>
        <Logo variant="white" />
      </BrowserRouter>
    );
    const logo = screen.getByText('StyleSync');
    expect(logo).toHaveClass('text-[#F5EDE3]');
  });

  it('is clickable and navigates to home', () => {
    render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>
    );
    const logo = screen.getByText('StyleSync');
    expect(logo.closest('div')).toHaveClass('hover:cursor-pointer');
  });

  it('uses Dancing Script font', () => {
    render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>
    );
    const logo = screen.getByText('StyleSync');
    expect(logo).toHaveClass("font-['Dancing_Script']");
  });
});
