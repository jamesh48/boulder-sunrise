import { useEffect } from 'react';

const useHandleInputBlur = (
  inputRef: React.RefObject<HTMLInputElement>,
  isInputFocused: boolean
) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && inputRef.current) {
        inputRef.current.blur();
      }
    };

    if (isInputFocused) {
      document.addEventListener('keypress', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [isInputFocused, inputRef]);
};

export default useHandleInputBlur;
