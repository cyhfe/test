/**
 * This is a Next.js page.
 */
import { trpc } from "../utils/trpc";

export default function IndexPage() {
  // 💡 Tip: CMD+Click (or CTRL+Click) on `greeting` to go to the server definition
  // const result = trpc.greeting.useQuery({ name: 'client' });

  // if (!result.data) {
  //   return (
  //     <div style={styles}>
  //       <h1>Loading...</h1>
  //     </div>
  //   );
  // }
  // return (
  //   <div style={styles}>
  //     {/**
  //      * The type is defined and can be autocompleted
  //      * 💡 Tip: Hover over `data` to see the result type
  //      * 💡 Tip: CMD+Click (or CTRL+Click) on `text` to go to the server definition
  //      * 💡 Tip: Secondary click on `text` and "Rename Symbol" to rename it both on the client & server
  //      */}
  //     <h1>{result.data.text}</h1>
  //   </div>
  // );
  // const CreateTodo = () => {
  //   const mutation = useMutation({
  //     mutationFn: (formData) => {
  //       return fetch('/api', formData)
  //     },
  //   })
  //   const onSubmit = (event) => {
  //     event.preventDefault()
  //     mutation.mutate(new FormData(event.target))
  //   }

  //   return <form onSubmit={onSubmit}>...</form>
  // }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
      }}
    >
      <label>keyword</label>
      <input type="text" name="keyword" />
      <label>start</label>
      <input type="number" name="start" />
      <label>display</label>
      <input type="number" name="display" />
      <button type="submit">Submit</button>
    </form>
  );
}

const styles = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
