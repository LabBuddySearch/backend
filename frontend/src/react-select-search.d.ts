declare module 'react-select-search' {
  import { ComponentType } from 'react';

  export interface SelectSearchOption {
    name: string;
    value: string | number;
    [key: string]: any;
  }

  export interface SelectSearchProps {
    options: SelectSearchOption[];
    value?: string | number | (string | number)[];
    onChange?: (value: any, option?: SelectSearchOption) => void;
    search?: boolean;
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
    disabled?: boolean;
    multiple?: boolean;
    closeOnSelect?: boolean;
    printOptions?: 'always' | 'on-focus' | 'never' | 'auto';
    onBlur?: () => void;
    onFocus?: () => void;
    [key: string]: any;
  }

  const SelectSearch: ComponentType<SelectSearchProps>;
  export default SelectSearch;
}