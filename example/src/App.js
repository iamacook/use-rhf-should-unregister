import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRHFShouldUnregister } from 'use-rhf-should-unregister';

const App = () => {
  const formRef = useRef(null);
  const { handleSubmit, register, unregister, watch } = useForm({
    defaultValues: {
      firstName: 'Aaron',
      lastName: 'Cook',
      hasPet: false,
      petName: { name: '' },
    },
  });

  useRHFShouldUnregister(formRef, unregister);

  const onSubmit = (data) => console.log(data);

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
