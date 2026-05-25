import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { usePainCardStore } from "@/store/painCard";

describe("CardScaffold", () => {
  beforeEach(() => {
    usePainCardStore.getState().reset();
  });

  it("renders the next action as a real link even when the card is incomplete", () => {
    render(
      <CardScaffold
        step={1}
        title="Card 1"
        instruction="Write something"
        readyToContinue={false}
        notReadyHint="You can finish this later."
      />,
    );

    const next = screen.getByRole("link", { name: "走下一張卡 →" });
    expect(next).toHaveAttribute("href", "/learn/worksheet/02");
    expect(next).not.toHaveAttribute("disabled");
    expect(screen.getByText("You can finish this later.")).toBeInTheDocument();
  });

  it("records the next step when the next link is clicked", () => {
    render(
      <CardScaffold
        step={6}
        title="Card 6"
        instruction="Write something"
        readyToContinue={false}
      />,
    );

    fireEvent.click(screen.getByRole("link", { name: "走下一張卡 →" }));

    expect(usePainCardStore.getState().card.current_step).toBe(7);
  });

  it("links card 13 to the result page", () => {
    render(
      <CardScaffold
        step={13}
        title="Card 13"
        instruction="Write something"
        readyToContinue={false}
        ctaLabel="走到結尾的 Pain ID 卡片 →"
      />,
    );

    expect(screen.getByRole("link", { name: "走到結尾的 Pain ID 卡片 →" })).toHaveAttribute(
      "href",
      "/learn/worksheet/result",
    );
  });
});
