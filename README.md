# `useRHFShouldUnregister()`

`useRHFShouldUnregister` is a polyfill for the deprecated `shouldUnregister` option in [React Hook Form](https://react-hook-form.com/) v7. It automatically unregisters unmounted fields. It takes a form `ref`, `unregister` and the optional 'keep state' [options object](https://react-hook-form.com/api/useform/unregister) that is applied to all unmounted fields.

## Installation

`npm install use-rhf-should-unregister`

## Usage

```tsx
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRHFShouldUnregister } from 'use-rhf-should-unregister';

type PersonalDetails = {
  firstName: string;
  lastName: string;
  hasPet: boolean;
  petName?: string;
};

const App = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { handleSubmit, unregister, watch } = useForm<PersonalDetails>({
    defaultValues: {
      firstName: 'Aaron',
      lastName: 'Cook',
      hasPet: false,
      petName: '',
    },
  });

  useRHFShouldUnregister<PersonalDetails>(formRef, unregister, {
    keepDirty: true,
    keepTouched: true,
  });

  const onSubmit = (data: Partial<PersonalDetails>) => console.log(data);

  const hasPet = watch('hasPet');

  return (
    <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
      <label htmlFor='firstName'>First name</label>
      <input {...register('firstName', { required: true })} />

      <label htmlFor='lastName'>Last name</label>
      <input {...register('lastName', { required: true })} />

      <label htmlFor='hasPet'>Do you have a pet?</label>
      <input type='checkbox' {...register('hasPet')} />

      {hasPet && (
        <>
          <label htmlFor='petName'>Pet name</label>
          <input {...register('petName', { required: true })} />
        </>
      )}

      <input type='submit' />
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

export const ShouldUnregisterInput = ({
  name,
  register,
  unregister,
  shouldUnregister = false,
  keepStateOptions = {},
}) => {
  useEffect(() => {
    return () => {
      if (!shouldUnregister) return;
      // Unregister input on unmount
      unregister(name, keepStateOptions);
    };
  }, [shouldUnregister, unregister]);

  return <input {...register(name)} />;
};

export const ShouldUnregisterControlledInput = ({
  name,
  shouldUnregister = false,
  keepStateOptions = {},
}) => {
  // Unregister can alternatively be passed via FormProvider
  const { unregister } = useFormContext();

  useEffect(() => {
    return () => {
      if (!shouldUnregister) return;
      // Unregister TextField on unmount
      unregister(name, keepStateOptions);
    };
  }, [shouldUnregister, unregister]);

  const {
    field: { ref, ...inputProps },
  } = useController({
    name,
    defaultValue: '',
    // { control } comes from FormProvider
  });

  return <TextField inputRef={ref} {...inputProps} />;
};

const App = () => {
  const { handleSubmit, register, unregister } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
        <ShouldUnregisterInput
          name='firstName'
          shouldUnregister
          register={register}
          unregister={unregister}
          keepStateOptions={{ keepDirty: true }}
        />
        <ShouldUnregisterControlledInput
          name='lastName'
          shouldUnregister
          keepStateOptions={{ keepDirty: true }}
        />
      </FormProvider>
    </form>
  );
};

export default App;
```
