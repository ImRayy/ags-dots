import Separator from "./separator";

export default function Title({ title }: { title: string }) {
  return (
    <box name="header" spacing={2}>
      <Separator />
      <label className="title" label={title} />
    </box>
  );
}
