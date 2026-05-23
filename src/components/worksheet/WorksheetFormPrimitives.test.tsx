/**
 * WorksheetFormPrimitives.test — component tests for the shared form widgets.
 *
 * These are pure presentational components — no router or store providers
 * required. Tests focus on:
 * - Labels render
 * - User input flows back through onChange
 * - List/CardBlock add/remove behavior
 * - Radio selection
 */

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import {
  CardBlock,
  ListField,
  RadioGroup,
  TextField,
  TextareaField,
} from "@/components/worksheet/WorksheetFormPrimitives";

describe("TextField", () => {
  it("renders label and value, calls onChange on input", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TextField label="姓名" value="林" onChange={onChange} />);

    expect(screen.getByText("姓名")).toBeInTheDocument();
    const input = screen.getByLabelText("姓名") as HTMLInputElement;
    expect(input.value).toBe("林");

    await user.type(input, "X");
    expect(onChange).toHaveBeenCalledWith("林X");
  });

  it("shows hint as placeholder", () => {
    render(<TextField label="x" hint="輸入 hint" value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("輸入 hint")).toBeInTheDocument();
  });

  it("keeps repeated labels connected to their own inputs", () => {
    render(
      <>
        <TextField label="方向的名字" value="" onChange={() => {}} />
        <TextField label="方向的名字" value="" onChange={() => {}} />
        <TextField label="方向的名字" value="" onChange={() => {}} />
      </>,
    );

    const inputs = screen.getAllByLabelText("方向的名字") as HTMLInputElement[];
    expect(inputs).toHaveLength(3);
    expect(new Set(inputs.map((input) => input.id)).size).toBe(3);
  });
});

describe("TextareaField", () => {
  it("renders a textarea with given rows", () => {
    render(<TextareaField label="筆記" value="" onChange={() => {}} rows={5} />);
    const textarea = screen.getByLabelText("筆記") as HTMLTextAreaElement;
    expect(textarea).toHaveAttribute("rows", "5");
  });

  it("propagates input through onChange", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TextareaField label="筆記" value="" onChange={onChange} />);
    await user.type(screen.getByLabelText("筆記"), "abc");
    // Without a parent rerender, the controlled value prop remains empty.
    expect(onChange).toHaveBeenLastCalledWith("c");
  });

  it("keeps typed text when controlled by a parent", async () => {
    function Harness() {
      const [value, setValue] = useState("");
      return <TextareaField label="筆記" value={value} onChange={setValue} />;
    }

    const user = userEvent.setup();
    render(<Harness />);
    const textarea = screen.getByLabelText("筆記") as HTMLTextAreaElement;

    await user.type(textarea, "abc");
    expect(textarea.value).toBe("abc");
  });

  it("keeps repeated labels connected to their own textareas", () => {
    render(
      <>
        <TextareaField label="為什麼這條值得聽" value="" onChange={() => {}} />
        <TextareaField label="為什麼這條值得聽" value="" onChange={() => {}} />
        <TextareaField label="為什麼這條值得聽" value="" onChange={() => {}} />
      </>,
    );

    const textareas = screen.getAllByLabelText("為什麼這條值得聽") as HTMLTextAreaElement[];
    expect(textareas).toHaveLength(3);
    expect(new Set(textareas.map((textarea) => textarea.id)).size).toBe(3);
  });
});

describe("RadioGroup", () => {
  it("renders all options with labels and descriptions", () => {
    render(
      <RadioGroup
        label="選一個"
        value={null}
        onChange={() => {}}
        options={[
          { value: "a", label: "A 選項", description: "a desc" },
          { value: "b", label: "B 選項" },
        ]}
      />,
    );

    expect(screen.getByText("A 選項")).toBeInTheDocument();
    expect(screen.getByText("a desc")).toBeInTheDocument();
    expect(screen.getByText("B 選項")).toBeInTheDocument();
  });

  it("marks the matching option as checked", () => {
    render(
      <RadioGroup
        label="x"
        value="b"
        onChange={() => {}}
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ]}
      />,
    );
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(true);
  });

  it("calls onChange when a different option is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RadioGroup
        label="x"
        value="a"
        onChange={onChange}
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ]}
      />,
    );
    await user.click(screen.getByText("B"));
    expect(onChange).toHaveBeenCalledWith("b");
  });
});

describe("ListField", () => {
  it("renders one input per item and an add button", () => {
    render(<ListField label="清單" items={["a", "b"]} onChange={() => {}} addLabel="＋ 再加" />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    expect(inputs).toHaveLength(2);
    expect(inputs[0].value).toBe("a");
    expect(inputs[1].value).toBe("b");
    expect(screen.getByText("＋ 再加")).toBeInTheDocument();
  });

  it("exposes the list as a named group", () => {
    render(<ListField label="清單" items={[]} onChange={() => {}} />);
    expect(screen.getByRole("group", { name: "清單" })).toBeInTheDocument();
  });

  it("calls onChange with appended item when add is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ListField label="x" items={["a"]} onChange={onChange} />);
    await user.click(screen.getByText("＋ 再加一條"));
    expect(onChange).toHaveBeenCalledWith(["a", ""]);
  });

  it("calls onChange without the removed item when ✕ is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ListField label="x" items={["a", "b", "c"]} onChange={onChange} />);
    const removeBtns = screen.getAllByLabelText("移除這條");
    await user.click(removeBtns[1]);
    expect(onChange).toHaveBeenCalledWith(["a", "c"]);
  });

  it("calls onChange with edited item on input change", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ListField label="x" items={["a"]} onChange={onChange} />);
    const input = screen.getAllByRole("textbox")[0];
    await user.type(input, "X");
    expect(onChange).toHaveBeenLastCalledWith(["aX"]);
  });
});

describe("CardBlock", () => {
  it("renders title and children", () => {
    render(
      <CardBlock title="第 1 個">
        <p>裡面的內容</p>
      </CardBlock>,
    );
    expect(screen.getByText("第 1 個")).toBeInTheDocument();
    expect(screen.getByText("裡面的內容")).toBeInTheDocument();
  });

  it("shows remove button only when onRemove is provided", () => {
    const { rerender } = render(
      <CardBlock title="x">
        <p>body</p>
      </CardBlock>,
    );
    expect(screen.queryByLabelText("移除這張")).not.toBeInTheDocument();

    rerender(
      <CardBlock title="x" onRemove={() => {}}>
        <p>body</p>
      </CardBlock>,
    );
    expect(screen.getByLabelText("移除這張")).toBeInTheDocument();
  });

  it("calls onRemove when ✕ is clicked", async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <CardBlock title="x" onRemove={onRemove}>
        <p>body</p>
      </CardBlock>,
    );
    await user.click(screen.getByLabelText("移除這張"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
