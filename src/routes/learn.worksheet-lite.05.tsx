import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { CardHero } from "@/components/worksheet/CardHero";
import { WorksheetCardHeader } from "@/components/worksheet/WorksheetCardHeader";
import { LiteField } from "@/components/worksheet-lite/LiteField";
import { LiteFooterNav } from "@/components/worksheet-lite/LiteFooterNav";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getInterviewReasonOptions } from "@/lib/painCardLite";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet-lite/05")({
  component: CardLite05Page,
});

function CardLite05Page() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);
  const reasons = getInterviewReasonOptions();

  const people = [...card.people.list];
  while (people.length < 3) {
    people.push({ name: "", contact: "", relation: "" });
  }

  const next = () => {
    if (
      people.some(
        (person) => !person.name.trim() || !person.contact.trim() || !person.relation.trim(),
      )
    ) {
      return;
    }
    updateField("people.list", people);
    advanceStep(6);
    navigate({ to: "/learn/worksheet-lite/06" });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 pb-32">
        <CardHero
          illustration="e12-three-named-people"
          alt="把抽象痛點，落到下週真的找得到的三個人"
        />
        <WorksheetCardHeader
          cardNumber={5}
          totalCards={6}
          aiStatus="disabled"
          title="找 3 個下週真的聯絡得到的人"
          rule="這張卡故意不讓 AI 代填。名字、聯絡方式、為什麼是他，全部得回到真人世界。"
          intro="沿用原專案結構裡『真人比答案重要』的精神，只是把時機移到更後面。"
        />

        <section className="space-y-6">
          {people.slice(0, 3).map((person, index) => (
            <div
              key={index}
              className="rounded-md border border-border-hairline bg-canvas-raised p-5 space-y-4"
            >
              <h2 className="text-[16px] font-semibold text-text-primary">真人 {index + 1}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <LiteField label="姓名">
                  <Input
                    value={person.name}
                    onChange={(e) => {
                      people[index].name = e.target.value;
                      updateField("people.list", [...people]);
                    }}
                    placeholder="真名或你慣用的化名"
                  />
                </LiteField>
                <LiteField label="聯絡方式">
                  <Input
                    value={person.contact}
                    onChange={(e) => {
                      people[index].contact = e.target.value;
                      updateField("people.list", [...people]);
                    }}
                    placeholder="電話、Email、LINE 都可以"
                  />
                </LiteField>
              </div>
              <LiteField label="為什麼是他">
                <Select
                  value={person.relation}
                  onValueChange={(value) => {
                    people[index].relation = value;
                    updateField("people.list", [...people]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選一個理由" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </LiteField>
            </div>
          ))}

          <LiteFooterNav
            onBack={() => navigate({ to: "/learn/worksheet-lite/04" })}
            onNext={next}
            blockedMessage={
              people.some(
                (person) =>
                  !person.name.trim() || !person.contact.trim() || !person.relation.trim(),
              )
                ? "3 個真人都要有名字、聯絡方式和選他的理由。"
                : null
            }
          />
        </section>
      </main>
    </div>
  );
}
