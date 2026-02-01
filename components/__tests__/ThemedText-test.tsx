import { render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemedText } from '../ThemedText';

it('renders correctly', async () => {
  render(
    <ThemeProvider>
      <ThemedText>Test text</ThemedText>
    </ThemeProvider>,
  );

  const text = await screen.findByText('Test text');
  expect(text).toBeOnTheScreen();
});
