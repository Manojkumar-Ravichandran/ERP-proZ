// import React, { useState } from 'react';
// import styles from './VerticalForm.css';
// import { useForm } from 'react-hook-form';
// import SubmitBtn from '../Buttons/SubmitBtn/SubmitBtn';

// export default function VerticalForm({ children, onSubmit }) {
//   const { register, handleSubmit, formState: { errors }, setValue } = useForm();
//   const [loading, setLoading] = useState(false);

//   const handleFormSubmit = async (data) => {
//     setLoading(true);
//     await onSubmit(data);
//     setLoading(false);
//   };

//   // Recursive function to handle nested elements
//   const renderChildren = (child) => {
//     if (React.isValidElement(child)) {
//       if (child.type === 'div') {
//         // If the child is a div, recursively process its children
//         return React.cloneElement(child, {
//           children: React.Children.map(child.props.children, renderChildren),
//         });
//       }
//       // Clone the child and pass `register` and `errors` props
//       return React.cloneElement(child, { register, errors, setValue });
//     }
//     return child;
//   };

//   return (
//     <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.verticalForm}>
//       <div className="row">
//         {React.Children.map(children, renderChildren)}
//       </div>
//       <div className="flex justify-end mt-3">
//         <button
//           type="button"
//           className="px-4 py-2 me-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
//         >
//           Cancel
//         </button>
//         <SubmitBtn loading={loading} label="Submit" />
//       </div>
//     </form>
//   );
// }



import React, { useState } from 'react';
import styles from './VerticalForm.css';
import { useForm } from 'react-hook-form';
import SubmitBtn from '../Buttons/SubmitBtn/SubmitBtn';

export default function VerticalForm({ children, onSubmit, showButtons = true }) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    await onSubmit(data);
    setLoading(false);
  };

  // Recursive function to handle nested elements
  const renderChildren = (child) => {
    if (React.isValidElement(child)) {
      if (child.type === 'div') {
        // If the child is a div, recursively process its children
        return React.cloneElement(child, {
          children: React.Children.map(child.props.children, renderChildren),
        });
      }
      // Clone the child and pass `register` and `errors` props
      return React.cloneElement(child, { register, errors, setValue });
    }
    return child;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.verticalForm}>
      <div className="row">
        {React.Children.map(children, renderChildren)}
      </div>
      {showButtons && ( // Conditionally render the button section
        <div className="flex justify-end mt-3">
          <button
            type="button"
            className="px-4 py-2 me-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Cancel
          </button>
          <SubmitBtn loading={loading} label="Submit" />
        </div>
      )}
    </form>
  );
}
