/* v18.13 · THE GREAT BOOKS HOUR, the 10/10 pass (owner, 17 Oct 2026: "rate this ... add everything so it's 10/10").
   Three new works, chosen for the highest return on an hour: Tolstoy's The Death of Ivan Ilyich and How Much Land
   Does a Man Need? (both in new translations made for this app from the Russian) and Nietzsche's On the Genealogy
   of Morals. For every book: the thread that ties it to the others ("in conversation with"), and one line worth
   knowing by heart, which joins the spaced review once the book is finished. */
(function () {
  const B = window.RN_BOOKS || (window.RN_BOOKS = []);
  B.push(
    {
      id: "ivan",
      essay: "austerlitz",
      years: "1886",
      guide: [
        "If you read only one short book about how to live, many readers would choose this one. Tolstoy wrote it at fifty-eight, after a crisis that nearly drove him to suicide. It is about a man who did everything right and discovers, too late, that it was not the right thing.",
        "The story opens at the end: Ivan Ilyich is dead, and his colleagues are already working out who gets his job. Then Tolstoy goes back and tells his life, 'most simple and ordinary, and most terrible', and then his dying. Two sittings: the life (chapters I to IV) and the dying (V to XII).",
        "It is not a medical story. The doctors are there as mirrors: they treat Ivan exactly as he treated the people in his courtroom, as cases on paper. That is the point.",
        "## Who is who",
        "* **Ivan Ilyich Golovin**, a judge, 45. Pleasant, correct, ambitious; he lives 'easily, pleasantly and decently'.",
        "* **Praskovya Fyodorovna**, his wife. Their marriage became a truce early on.",
        "* **Pyotr Ivanovich** and **Schwartz**, colleagues; Schwartz is what Ivan was, and wants a game of cards tonight.",
        "* **Gerasim**, a young peasant servant, the only person who does not lie to him.",
        "* **Vasya**, his schoolboy son; **Liza**, his daughter, and her fiancé **Petrishchev**.",
        "## What to watch for",
        "* The medallion he wears from his student days: *respice finem*, consider the end. He never does.",
        "* The drawing room he furnishes, which looks exactly like everyone else's, and the fall from the ladder.",
        "* Caius: the syllogism 'all men are mortal' is true of everyone but me.",
        "* The lie everyone tells him, and the one person who will not tell it.",
        "* The last chapter: the black sack, the light, and the hand on his son's head.",
        "## Carry these questions",
        "What in your life is 'easy, pleasant and decent' but not the right thing? Who in your life is your Gerasim? If you had Ivan's last three days, what would you see?",
      ],
      prompts: ["Where does Ivan's life look like yours, honestly?", "What does Gerasim give him that no one else can?", "What is 'the right thing' that Ivan finds at the end?"],
    },
    {
      id: "howmuch",
      essay: "austerlitz",
      years: "1886",
      guide: [
        "A short parable, half an hour of reading, which James Joyce called the greatest story in the world. Tolstoy wrote it for ordinary Russian readers, in the plain style of a folk tale. Use the rest of the hour to write.",
        "Pakhom, a peasant, boasts that if he had enough land even the Devil could not frighten him. The Devil, listening behind the stove, takes the bet. A desyatina is about 2.7 acres; a verst is about two thirds of a mile; the numbers in this translation are given in acres and miles.",
        "## What to watch for",
        "* Every gain comes with a new feeling of being cramped. Notice exactly when the land that was enough stops being enough.",
        "* The dream before the last day: each of the men who tempted him turns into the same figure.",
        "* 'An hour to suffer, a lifetime to live': the bargain he makes with himself at noon.",
        "* The last line, and the length of it.",
        "## Carry this question",
        "What is your land: the thing you keep wanting a little more of? How much of it do you actually need?",
      ],
      prompts: ["At what point should Pakhom have stopped?", "Where in your own life is the 'one more stretch' that is never enough?"],
    },
    {
      id: "genealogy",
      essay: "madman",
      years: "1887",
      guide: [
        "Nietzsche's most systematic book, written as a sequel to Beyond Good and Evil. It asks where our moral ideas came from, and what they have been doing to us. It is a polemic: angry, funny and unsettling, and one of the most influential books of the modern age (Freud, Foucault and much of modern psychology grow out of it).",
        "Three essays, on the essential route in three sittings, with the end of the third summed up for you.",
        "## The three essays",
        "**First: 'Good and Evil', 'Good and Bad'.** There were two moralities. The nobles called themselves 'good' and the common people 'bad', meaning simply low. Then the weak, who could not take revenge in deeds, took it in values: they called the strong 'evil' and their own weakness 'good'. Nietzsche calls this the slave revolt in morality, born of *ressentiment*.",
        "**Second: 'Guilt', 'Bad Conscience' and the like.** Guilt began as debt: the creditor's right to inflict pain. Bad conscience is what happens when human beings are shut inside society and their aggression, with nowhere to go, turns inward against themselves.",
        "**Third: What is the meaning of ascetic ideals?** Why have priests, philosophers and saints so often preached self-denial? Because human beings need a meaning for their suffering, and 'man would rather will nothingness than not will at all'.",
        "## A warning",
        "Nietzsche writes about 'races', 'masters' and 'blond beasts' in ways that were later abused. He despised antisemitism and German nationalism, and says so in this book. Read the argument, not the slogans.",
        "## Carry these questions",
        "When you call something 'evil', is it ever really envy? Where has your own aggression turned inward? What do you need your suffering to mean?",
      ],
      prompts: ["Find one of your own moral judgements that might be ressentiment.", "What, in your words, is 'bad conscience'?", "What would it mean to give your suffering a meaning without hating life?"],
    },
  );

  // the essential route for the Genealogy: the three sittings that carry the argument; the rest of Essay III in brief
  const g = B.find((x) => x.id === "genealogy");
  if (g)
    g.route = {
      read: [1, 2, 3],
      tail: {
        3: "The rest of the Third Essay (sections 4 to 28) answers its question. For the artist, the ascetic ideal means little; for the philosopher, it is the condition of his work (quiet, poverty, chastity are his tools, not his virtues). Its real home is the priest, who heals the suffering herd by changing the direction of its ressentiment: 'someone must be to blame for my suffering', says the sufferer, and the priest replies, 'Quite right: you yourself are to blame.' Guilt and sin are the result. Even modern science and atheism, Nietzsche argues, are the last form of this ideal: the will to truth at any price. The last section is the book's great sentence: the ascetic ideal gave suffering a meaning, any meaning being better than none, and so 'man would rather will nothingness than not will at all.' Go back to it at any time from All books.",
      },
    };

  // the order: long and short alternate, so every week finishes something; Ivan Ilyich comes early because nothing
  // else repays an hour so well
  const ORDER = ["underground", "apology", "enchiridion", "shortness", "ivan", "phaedo", "cave", "ridiculous", "howmuch", "overcoat", "meditations", "ladydog", "zarathustra", "genealogy", "bartleby", "symposium", "hamlet", "camus", "bge", "crime", "karamazov", "anna"];
  B.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

  const APPLY = {
    ivan: ["Write one sentence: what would I regret if I learned today that I had a year left? Do one small thing about it before you sleep.", "Be someone's Gerasim today: sit with a person who is struggling, and do not pretend things are fine.", "Look at one thing you do only because 'people like us' do it. Is it the right thing?"],
    howmuch: ["Name your 'land': the thing you keep wanting more of. Write down the amount that would truly be enough.", "Stop one thing today before you are tired of it: leave the last stretch unwalked."],
    genealogy: ["When you feel righteous anger today, ask: is any of this envy? Write the honest answer.", "Turn one piece of self-blame into an action: what will you do, instead of how bad you are?", "Find one meaning in a difficulty you are going through that makes it worth bearing."],
  };
  for (const b of B) if (APPLY[b.id]) b.apply = APPLY[b.id];

  // in conversation with: how each book answers the others (shown in the guide and at the end of the book)
  const THREADS = {
    underground: "Starts the argument the whole shelf continues: are we rational creatures, or creatures who want to be free even against our interest? Raskolnikov, Ivan Karamazov and Camus's absurd man are all his descendants.",
    apology: "Socrates is the first answer to the Underground Man: a man who knows he knows nothing, and lives calmly and dies calmly because of it. Nietzsche will attack him; the Stoics will follow him.",
    enchiridion: "The Stoic toolkit: what is in your power and what is not. Marcus Aurelius read Epictetus every day; Ivan Ilyich lived as if everything were in his power until the one thing that was not.",
    shortness: "Seneca's question, 'how much of your life was really yours?', is the question Ivan Ilyich asks on his deathbed, too late. Read it again after Tolstoy.",
    ivan: "Tolstoy's answer to Seneca and to the Phaedo: death shows what a life was worth. Gerasim is a cousin of Sonia in Crime and Punishment and of Alyosha Karamazov; Levin in Anna Karenina asks Ivan's question while he is still healthy.",
    phaedo: "Socrates dies like the opposite of Ivan Ilyich: prepared, curious, surrounded by friends, joking about a debt of a cock to Asclepius. Philosophy, he says, is practice for dying.",
    cave: "The image behind the whole shelf: we live among shadows we take for reality. Ivan Ilyich's drawing room is a cave; Zarathustra comes down from his mountain like the freed prisoner coming back.",
    ridiculous: "Dostoevsky's own answer to the Underground Man: a man about to shoot himself is saved by a little girl he refused to help, and by a dream of paradise. 'Love others as yourself' is the whole of it.",
    howmuch: "The shortest version of Ivan Ilyich's mistake: always one more stretch. Compare Epictetus (want only what is in your power) and Seneca (you are not short of time, you waste it).",
    overcoat: "The 'little man' that Dostoevsky said all Russian literature came out of. Akaky's 'I am your brother' rings through Crime and Punishment and Karamazov.",
    meditations: "An emperor's private notes to himself, putting Epictetus into practice. Nietzsche admired the discipline and rejected the resignation; Camus's 'one must imagine Sisyphus happy' is a modern Stoic sentence.",
    ladydog: "Chekhov shows a cynical man changed by love without any preaching at all; compare Tolstoy's preaching in Ivan Ilyich and Anna Karenina, and decide which convinces you more.",
    zarathustra: "Nietzsche's answer to Socrates, to Christianity and to the Stoics: God is dead, so create your own values and say yes to life, even to its eternal recurrence. Dostoevsky's Ivan Karamazov argues the same premise to the opposite conclusion.",
    genealogy: "The sharpest attack on the morality the Russian novels defend. Read it, then read Dostoevsky's Grand Inquisitor and Zossima, and judge between them. The Underground Man's spite is Nietzsche's ressentiment.",
    bartleby: "'I would prefer not to': the Underground Man's refusal without the talk. Camus's Stranger is Bartleby's grandson.",
    symposium: "Love as a ladder from one beautiful body to beauty itself. Compare Anna's love, which destroys her, and Levin's, which makes him a father and a farmer.",
    hamlet: "The thinking man who cannot act: Shakespeare's version of the Underground Man, two hundred and sixty years earlier. 'The readiness is all' is Hamlet's Stoic ending.",
    camus: "The twentieth century's answer to the whole shelf without God: the absurd, revolt, and decency anyway. He learned it from Dostoevsky, whose Possessed he adapted for the stage, and from Nietzsche.",
    bge: "Nietzsche's map of 'the philosophy of the future'. The Genealogy is its working-out; Crime and Punishment is the novel that tests what happens when a man believes he is beyond good and evil.",
    crime: "Raskolnikov tests the Underground Man's freedom and Nietzsche's 'extraordinary man' with an axe, and Sonia answers both. Ivan Karamazov's 'everything is permitted' is the same idea grown up.",
    karamazov: "Dostoevsky's last word, with every voice on the shelf in it: the Grand Inquisitor against freedom, Ivan's rebellion against God, Zossima's active love, Alyosha's childhood memory that can save a life.",
    anna: "Tolstoy sets two lives side by side: Anna, who lives for passion, and Levin, who searches for the meaning of life and finds it in a peasant's sentence. It is Ivan Ilyich's question asked by the living.",
  };
  // one line worth knowing by heart (in the app's own translations where the book is ours)
  const HEART = {
    underground: "I am a sick man... I am a spiteful man.",
    apology: "The unexamined life is not worth living.",
    enchiridion: "Of things some are in our power, and others are not.",
    shortness: "We do not have a very short time assigned to us, but we lose a great deal of it.",
    ivan: "The past history of Ivan Ilyich's life was most simple and ordinary, and most terrible.",
    phaedo: "The true philosophers are always occupied in the practice of dying.",
    cave: "To them the truth would be literally nothing but the shadows of the images.",
    ridiculous: "The main thing is to love others as yourself; that is the main thing, and that is everything.",
    howmuch: "The labourer dug a grave for Pakhom exactly as long as he measured from his feet to his head, six feet.",
    overcoat: "Leave me alone; why do you insult me? ... I am your brother.",
    meditations: "Do every act of thy life as if it were the last.",
    ladydog: "It seemed that a little more, and the solution would be found, and then a new and beautiful life would begin.",
    zarathustra: "Man is a rope, tied between beast and Overman: a rope over an abyss.",
    genealogy: "Man would rather will nothingness than not will at all.",
    bartleby: "I would prefer not to.",
    symposium: "The desire and pursuit of the whole is called love.",
    hamlet: "If it be not now, yet it will come. The readiness is all.",
    camus: "One must imagine Sisyphus happy.",
    bge: "He who fights with monsters should be careful lest he thereby become a monster.",
    crime: "Go at once, this very minute, stand at the cross-roads, bow down, first kiss the earth which you have defiled.",
    karamazov: "Some good, sacred memory, preserved from childhood, is perhaps the best education.",
    anna: "Happy families are all alike; every unhappy family is unhappy in its own way.",
  };
  for (const b of B) {
    if (THREADS[b.id]) b.threads = THREADS[b.id];
    if (HEART[b.id]) b.heart = HEART[b.id];
  }
})();
