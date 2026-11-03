import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Lobby } from '../components/Lobby';
import { Button } from '../components/ui/Button';

describe('Reusable UI & Lobby Components', () => {
  it('renders Button component with children and handles onClick', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Start Stream</Button>);

    const button = screen.getByRole('button', { name: /start stream/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders Lobby and submits join payload with generated room code if empty', () => {
    const handleJoin = vi.fn();
    render(<Lobby onJoinRoom={handleJoin} />);

    const nameInput = screen.getByPlaceholderText(/e\.g\. Alex/i);
    fireEvent.change(nameInput, { target: { value: 'MovieHost' } });

    const submitBtn = screen.getByRole('button', { name: /create cinema lounge/i });
    fireEvent.click(submitBtn);

    expect(handleJoin).toHaveBeenCalledTimes(1);
    expect(handleJoin.mock.calls[0][0].userName).toBe('MovieHost');
    expect(handleJoin.mock.calls[0][0].isHost).toBe(true);
    expect(handleJoin.mock.calls[0][0].roomId).toMatch(/^mesh-/);
  });

  it('automatically pre-fills roomId and switches to viewer join mode when initialRoomId prop is provided', () => {
    const handleJoin = vi.fn();
    render(<Lobby onJoinRoom={handleJoin} initialRoomId="marvel-watch-2026" />);

    // Room code input should have initialRoomId pre-filled
    const roomInput = screen.getByDisplayValue('marvel-watch-2026');
    expect(roomInput).toBeInTheDocument();

    // Submit button should say "Join Lounge" since it switches to Viewer mode automatically
    const joinBtn = screen.getByRole('button', { name: /join lounge/i });
    expect(joinBtn).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/e\.g\. Alex/i);
    fireEvent.change(nameInput, { target: { value: 'PhoneFriend' } });
    fireEvent.click(joinBtn);

    expect(handleJoin).toHaveBeenCalledWith({
      roomId: 'marvel-watch-2026',
      userName: 'PhoneFriend',
      isHost: false,
    });
  });
});
