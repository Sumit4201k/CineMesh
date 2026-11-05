import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Lobby } from '../components/Lobby';
import { Button } from '../components/ui/Button';

describe('Reusable UI & Lobby Components (Cinematic Redesign)', () => {
  it('renders Button component with children and handles onClick', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Start Stream</Button>);

    const button = screen.getByRole('button', { name: /start stream/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders Lobby in normal mode with empty alias and empty room code', () => {
    const handleJoin = vi.fn();
    render(<Lobby onJoinRoom={handleJoin} />);

    const nameInput = screen.getByPlaceholderText(/e\.g\. Alex/i);
    expect(nameInput.value).toBe('');

    fireEvent.change(nameInput, { target: { value: 'MovieHost' } });

    const submitBtn = screen.getByRole('button', { name: /launch cinema lounge/i });
    fireEvent.click(submitBtn);

    expect(handleJoin).toHaveBeenCalledTimes(1);
    expect(handleJoin.mock.calls[0][0].userName).toBe('MovieHost');
    expect(handleJoin.mock.calls[0][0].isHost).toBe(true);
    expect(handleJoin.mock.calls[0][0].roomId).toMatch(/^mesh-/);
  });

  it('automatically generates a random cinema guest alias and pre-fills roomId when initialRoomId prop is provided', () => {
    const handleJoin = vi.fn();
    render(<Lobby onJoinRoom={handleJoin} initialRoomId="marvel-watch-2026" />);

    // Room code input should have initialRoomId pre-filled
    const roomInput = screen.getByDisplayValue('marvel-watch-2026');
    expect(roomInput).toBeInTheDocument();

    // User name input should be automatically populated with a random guest name
    const nameInput = screen.getByPlaceholderText(/e\.g\. Alex/i);
    expect(nameInput.value).not.toBe('');
    expect(nameInput.value.length).toBeGreaterThan(3);

    // Mode is automatically switched to viewer join mode
    const joinBtn = screen.getByRole('button', { name: /join lounge/i });
    expect(joinBtn).toBeInTheDocument();

    // User can immediately click "Join Lounge" with the random name with 1 click!
    fireEvent.click(joinBtn);

    expect(handleJoin).toHaveBeenCalledWith({
      roomId: 'marvel-watch-2026',
      userName: nameInput.value,
      isHost: false,
    });
  });
});
