import { useState } from "react";

import {
  Button,
  Input,
  Modal,
  Loader,
  showToast,
} from "../components/ui";

function ComponentsDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        UI Components Demo
      </h1>

      <div className="space-y-6">

        <Button variant="primary">
          Primary Button
        </Button>

        <Button variant="secondary">
          Secondary Button
        </Button>

        <Button variant="outline">
          Outline Button
        </Button>

        <Input
          label="Product Name"
          placeholder="Enter product name"
        />

        <Button
          onClick={() => setIsOpen(true)}
        >
          Open Modal
        </Button>

        <Button
          onClick={showToast}
        >
          Show Toast
        </Button>

        <Loader />

      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Sample Modal"
      >
        <p>
          This is a reusable modal component.
        </p>
      </Modal>

    </div>
  );
}

export default ComponentsDemo;