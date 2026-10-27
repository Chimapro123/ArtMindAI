import { useState } from "react";
import { ChevronIcon } from "../../components/Icons";
import "./Faq.css";

const questions = [
  { question: "Do I have to pay for anything?", answer: "No. Everything here is free to look at, and your pass is free too." },
  {
    question: "Can I use these images in my own work?",
    answer: "Yes. Every painting here is in the public domain, so you can use the images freely. Each painting's page links to where its image came from."
  },
  {
    question: "Why does the guide sometimes say it isn't sure?",
    answer: "The guide only talks about the paintings in this gallery, and it would rather tell you it isn't sure than guess."
  },
  {
    question: "How does the gallery learn what I like?",
    answer: "It notices the paintings you open, save and search for, and uses that to suggest others. Only you can see your room."
  },
  { question: "How do I close my account?", answer: "Go to your profile and choose Close my pass at the bottom. Everything you saved goes with it." }
];

function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="dark-section faq">
      <div className="container">
        <p className="small-label">Questions people ask</p>
        <div className="faq-list">
          {questions.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.question} className={"faq-item" + (isOpen ? " faq-item-open" : "")}>
                <button type="button" className="faq-question" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : index)}>
                  <span>{item.question}</span>
                  <ChevronIcon size={20} />
                </button>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Faq;
