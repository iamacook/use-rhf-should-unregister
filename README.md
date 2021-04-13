# `useRHFShouldUnregister()`

`useRHFShouldUnregister` is a polyfill for the deprecated `shouldUnregister` option in [React Hook Form](https://react-hook-form.com/) v7. It automatically unregisters unmounted inputs. It takes two arguments, a form `ref` and `unregister`.

## Installation

`npm install use-rhf-should-unregister`

## Usage

```jsx
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRHFShouldUnregister } from 'use-rhf-should-unregister';

const App = () => {
  const formRef = useRef(null);
  const { handleSubmit, unregister } = useForm();

  useRHFShouldUnregister(formRef, unregister);

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={onSubmit} ref={formRef}>
	  {/* ... */}
	</form>
  );
};

export default App;
```

## Alternatives

As an alternative to using `useRHFShouldUnregister`, you can create your own custom input component that calls `unregister` in the `useEffect` cleanup.

```jsx
import { TextField } from '@material-ui/core';
import { useEffect } from 'react';
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
} from 'react-hook-form';

export const ShouldUnregisterInput = ({ name, register, unregister, shouldUnregister = false }) => {
  useEffect(() => {
    return () => {
      if (!shouldUnregister) return;
      // Unregister input on unmount
      unregister(name);
    };
  }, [shouldUnregister, unregister]);

  return <input {...register(name)} />;
};

export const ShouldUnregisterControlledInput = ({ name, shouldUnregister = false }) => {
  // Unregister can alternatively be passed via FormProvider
  const { unregister } = useFormContext();

  useEffect(() => {
    return () => {
      if (!shouldUnregister) return;
      // Unregister input on unmount
      unregister(name);
    };
  }, [shouldUnregister, unregister]);

  const {
    field: { ref, ...inputProps },
  } = useController({
    name,
    defaultValue: '',
    // { control } comes from FormProvider
  });

  return <TextField {...inputProps} inputRef={ref} />;
};

const App = () => {
  const { handleSubmit, register, unregister } = useForm();

  const onSubmit = (data) => console.log(data)

  return (
    <form onSubmit={onSubmit}>
      <FormProvider {...methods}>
      <ShouldUnregisterInput name='firstName' shouldUnregister register={register}  unregister={unregister} />
      <ShouldUnregisterControlledInput name='lastName' shouldUnregister />
      <FormProvider>
    </form>
  );
};

export default App;
```
