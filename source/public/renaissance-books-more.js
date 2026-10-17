/* THE GREAT BOOKS HOUR · v18.11 (owner, 17 Oct 2026: "add Camus and more of the classics ... I get the benefits and
   knowledge but I don't waste my time on low-ROI stuff").
   1) More short masterpieces, each one sitting or a few: Epictetus, Seneca, Plato's cave and Symposium, Dostoevsky's
      Dream of a Ridiculous Man, Gogol, Chekhov, Melville, Hamlet, Beyond Good and Evil, and a study of Camus (his
      books are in copyright, so it is an original study with short quotations).
   2) The essential route: in the long books you read the chapters that carry the book; the stretches between are
      given as a short bridge ("what happened") before the next chapter you read. Any book can be switched to every
      chapter from "All books".
   3) A new order that alternates long and short so every week has a finished masterpiece in it. */
(function () {
  const B = (window.RN_BOOKS = window.RN_BOOKS || []);
  const add = (o) => B.push(o);
  add({
    id: "enchiridion",
    essay: "",
    years: "c. AD 125",
    guide: [
      "Epictetus was born a slave in Asia Minor, lame (by tradition his master twisted his leg until it broke), freed in Rome, banished with all philosophers by the emperor Domitian, and taught for the rest of his life in a small school in Greece. He wrote nothing. A student, Arrian, took notes, and boiled the teaching down into this little handbook, the *Encheiridion*, 'the thing you keep at hand'. Marcus Aurelius, an emperor, learned his philosophy from the words of a former slave.",
      "## The one idea",
      "It opens with the sentence that the whole of Stoicism hangs on: some things are up to us, and some are not up to us. Up to us: our judgements, our impulses, our desires, our aversions, in a word, our own doing. Not up to us: the body, property, reputation, positions of power. Everything else in the book is that idea applied: to loss, insult, fear, ambition, the dinner party, the theatre, the bath.",
      "## What to watch for",
      "* 'What troubles people is not things, but their judgements about things.' (5)",
      "* Never say 'I have lost it', but 'I have given it back.' (11)",
      "* The banquet: take your share politely when the dish comes round; if it passes you, don't hold it back; if it hasn't reached you yet, wait. (15)",
      "* You are an actor in a play chosen by another; your business is to play well the part you are given. (17)",
      "## Carry this",
      "Before reacting to anything this week, ask: is this up to me or not?",
    ],
    prompts: ["List three things that upset you this week. Which were up to you?", "Which sentence would you keep in your pocket, and why?", "Where are you stretching out for a dish that has passed you?"],
  });
  add({
    id: "shortness",
    essay: "",
    years: "c. AD 49",
    guide: [
      "Seneca was the richest and most powerful intellectual in Rome: playwright, philosopher, senator, and tutor and then chief minister to the young emperor Nero, who in the end ordered him to kill himself. He wrote this letter-essay to his father-in-law Paulinus, who managed Rome's grain supply, a busy man.",
      "## The argument",
      "It is not that we have a short time to live, but that we waste much of it. Life is long enough if you know how to use it. People guard their money and property fiercely, and let anyone at all take their time, the one thing it is right to be stingy with. The busy man is the last to learn how to live; he is always about to begin.",
      "## What to watch for",
      "* The account book: count up how much of your life went to creditors, lovers, quarrels, clients, illness, idleness, and see how little was yours.",
      "* Putting things off is the greatest waste of life: we lose today by waiting for tomorrow.",
      "* The cure he proposes: time with the great minds of the past, who are open to anyone and give you their years.",
      "## Carry this",
      "This is the reason the Great Books Hour exists. Read it as a mirror.",
    ],
    prompts: ["Do Seneca's account book for yesterday: where did the hours go?", "What are you postponing until 'later'?", "Which of his sentences stung?"],
  });
  add({
    id: "cave",
    essay: "",
    years: "c. 375 BC",
    guide: [
      "The most famous image in philosophy: prisoners chained in a cave since childhood, facing the back wall, watching shadows of objects carried past a fire behind them, and taking the shadows for reality. One is freed, dragged up into the sunlight, blinded, slowly learns to see things, and finally the sun itself. Then he goes back down to free the others, and they laugh at him, and would kill him if they could.",
      "## Where you are",
      "This is Book VII of Plato's *Republic*, a long conversation in which Socrates and his friends design an ideal city to find out what justice is. The cave is Socrates' picture of education: not putting sight into blind eyes but turning the whole soul round towards the light. The rest of the book asks what the rulers of a good city would have to study (arithmetic, geometry, astronomy, harmony, and finally dialectic) and why they must be made to go back down into the cave to govern.",
      "## What to watch for",
      "* The pain of the light: understanding hurts before it helps.",
      "* The return: why the freed man looks foolish in the dark, and why he must go back anyway.",
      "* Remember the Apology: the prisoners who would kill the man who frees them are Athens, and he is Socrates.",
      "## Carry this",
      "What shadows have you taken for the real thing? Who was the person who first turned you round?",
    ],
    prompts: ["Name one of your 'shadows' and the thing that casts it.", "Why must the freed man go back down?", "What hurt when you first understood something important?"],
  });
  add({
    id: "symposium",
    essay: "",
    years: "c. 385 BC",
    guide: [
      "A dinner party in Athens in 416 BC, the night after the young poet Agathon won the prize for tragedy. Everyone is hung over, so they agree to drink lightly and instead each make a speech in praise of Love (Eros). It is the most charming thing Plato wrote and the source of the phrase 'platonic love'.",
      "## The speeches, in order",
      "Phaedrus (love makes us brave and noble); Pausanias (two loves, heavenly and common); Eryximachus (love as harmony in all things); then Aristophanes the comic poet with the unforgettable myth of the original double humans, split in two by Zeus, each half for ever searching for its other half; Agathon (a beautiful, empty speech); then Socrates, who repeats what the wise woman Diotima taught him: love is not a god but a longing for what we lack, and it climbs a ladder, from one beautiful body to all beauty, to beautiful souls, laws and knowledge, and finally to Beauty itself.",
      "Then Alcibiades bursts in drunk, the most glamorous and dangerous man in Athens, and gives a speech in praise not of love but of Socrates, who resisted him.",
      "## Carry this",
      "What do you love that is really a longing for something you lack? Where are you on Diotima's ladder?",
    ],
    prompts: ["Which speech is truest about love as you have known it?", "Explain Aristophanes' myth in two sentences.", "What would Diotima say you are really longing for?"],
  });
  add({
    id: "ridiculous",
    essay: "",
    years: "1877",
    guide: [
      "A short story Dostoevsky called 'a fantastic story', and perhaps the most concentrated thing he wrote. A man in St Petersburg has decided nothing matters and that he will shoot himself tonight. On the way home a small girl, terrified, tugs at his sleeve begging for help for her mother; he drives her away. At home with the revolver in front of him, he is troubled that he felt anything at all. He falls asleep and dreams.",
      "## What to watch for",
      "* The dream: a world without sin, and what he does to it.",
      "* How the story answers the Underground Man and Ivan Karamazov in twelve pages, without an argument.",
      "* The last line, about the little girl.",
      "## Carry this",
      "What would it take for you to 'love others as yourself' for one day? Dostoevsky says that is all of it.",
    ],
    prompts: ["What did he do to the dream world, and why?", "Why does the little girl matter so much?", "Write the story in three sentences."],
  });
  add({
    id: "overcoat",
    essay: "",
    years: "1842",
    guide: [
      "Dostoevsky is supposed to have said that all of Russian literature came out from under Gogol's 'Overcoat'. (He probably never said it; it is still true.) Akaky Akakievich is a copying clerk in a government office in St Petersburg, mocked by everyone, who loves nothing but copying documents beautifully. His threadbare coat can no longer be mended. Saving for a new one changes his life. Then the coat is stolen.",
      "This old translation calls it 'The Mantle'.",
      "## What to watch for",
      "* The narrator's voice: jokes, digressions, a comic tone that suddenly lets in a terrible sadness.",
      "* The young clerk who stops mocking Akaky and hears in his voice 'I am your brother'.",
      "* The 'Very Important Person', and the ending, which is a ghost story.",
      "## Carry this",
      "Who is the Akaky Akakievich in your world, the person everyone overlooks?",
    ],
    prompts: ["Is the story funny or tragic? Find one sentence that is both.", "What does the coat mean to him?", "Who is 'your brother' that you have mocked or ignored?"],
  });
  add({
    id: "ladydog",
    essay: "",
    years: "1899",
    guide: [
      "Many writers consider it the best short story ever written. Gurov, a bored, cynical Moscow banker who has had many affairs, meets a young married woman walking a small white dog on the seafront at Yalta. A holiday romance, he thinks; it will end like the others. It doesn't.",
      "## What to watch for",
      "* What Chekhov leaves out: no judgement, no moral, no explanation.",
      "* The scene above the sea at Oreanda, and what Gurov thinks about eternity.",
      "* The ending, which ends nothing: 'the most complicated and difficult part of it was only just beginning'.",
      "## Carry this",
      "Chekhov said the writer's job is not to solve a problem but to state it correctly. What problem does this story state?",
    ],
    prompts: ["When does Gurov change, and how do you know?", "Why does the story stop where it does?", "Write the moral Chekhov refused to write, then cross it out."],
  });
  add({
    id: "bartleby",
    essay: "",
    years: "1853",
    guide: [
      "A comfortable Wall Street lawyer hires a pale, neat, silent young copyist named Bartleby. At first he works tremendously. Then, asked to check a document, he answers: 'I would prefer not to.' He goes on preferring not to: not to work, not to explain, not to leave. Written by the author of Moby-Dick two years after it failed.",
      "## What to watch for",
      "* The narrator: decent, comfortable, baffled, and how he keeps trying to be kind on his own terms.",
      "* The five words, and how they spread through the office.",
      "* The rumour at the end about the Dead Letter Office, and the last line.",
      "## Carry this",
      "Is Bartleby a rebel, a saint, or a man in despair? Compare him with the Underground Man.",
    ],
    prompts: ["What does 'I would prefer not to' refuse?", "Was the narrator a good man?", "What would you prefer not to, if you dared?"],
  });
  add({
    id: "hamlet",
    essay: "",
    years: "c. 1600",
    guide: [
      "The most famous play in the world, read in three sittings. Prince Hamlet of Denmark comes home from university for his father's funeral, and finds his mother already married to his uncle Claudius, the new king. A ghost on the battlements says it is his father, murdered by Claudius, and demands revenge. Hamlet promises, and then cannot act.",
      "## Who is who",
      "Hamlet; Claudius, the king; Gertrude, the queen, Hamlet's mother; Polonius, the king's chief counsellor, and his children Laertes and Ophelia (whom Hamlet loved); Horatio, Hamlet's loyal friend; Rosencrantz and Guildenstern, old schoolfriends turned spies; Fortinbras, prince of Norway, a man of action.",
      "## How to read it",
      "Read the speeches aloud, especially the soliloquies, when Hamlet is alone and thinks aloud: 'O, that this too too solid flesh would melt' (I.2), 'O, what a rogue and peasant slave am I' (II.2), 'To be, or not to be' (III.1), 'How all occasions do inform against me' (IV.4). Don't stop for every unfamiliar word; the sense carries.",
      "## Carry these questions",
      "Why does Hamlet delay? Is he too thoughtful, too honest, too afraid, or does he simply not believe the ghost? And what does he finally understand in Act V ('the readiness is all')?",
    ],
    prompts: ["Copy one line of Hamlet's you will keep for life.", "Why does he delay, in your judgement today?", "Which character is most like you?"],
  });
  add({
    id: "camus",
    essay: "sisyphus",
    years: "1942–1956",
    guide: [
      "Camus's books are still in copyright, so the app cannot carry them. Instead, this is a full study of his four great works, written for this hour: The Stranger, The Myth of Sisyphus, The Rebel, The Plague and The Fall, with the story of each, the key scenes, the ideas, the quarrels, and his most important lines in short quotation. About twenty-five minutes. If one of them grips you, buy it: The Stranger and The Fall are an evening each.",
    ],
    prompts: ["Is Meursault guilty of what he was condemned for? Of what he did?", "Which of revolt, freedom and passion do you most lack?", "What is your 'invincible summer'?"],
  });
  add({
    id: "bge",
    essay: "madman",
    years: "1886",
    guide: [
      "Nietzsche's most compressed attack on the philosophers who came before him, and on the morality of his time, written in 296 numbered sections and a closing poem. After Zarathustra's poetry, this is the same thought as argument and aphorism.",
      "## The route",
      "You read the Preface and Part One ('Prejudices of Philosophers': every great philosophy is the personal confession of its author; the will to truth itself must be questioned), Parts Two and Three (the 'free spirits' of the future; religion), and Part Nine, 'What is Noble?' (master and slave morality, the pathos of distance). A bridge summarises the parts between.",
      "## What to watch for",
      "* Section 1: why do we want truth at all, and not rather untruth?",
      "* Section 146: 'He who fights with monsters should be careful lest he thereby become a monster. And if thou gaze long into an abyss, the abyss will also gaze into thee.'",
      "* Section 260: master morality ('good and bad') and slave morality ('good and evil').",
      "## Carry this",
      "Which of your moral beliefs is a confession about you?",
    ],
    prompts: ["Which section today would you argue with?", "What is 'noble', for Nietzsche, in one sentence?", "Where have you become like the monster you fought?"],
  });

  // the essential route: the sittings you read; bridges sum up the chapters between (keyed by the sitting they precede)
  const ROUTE = {
    phaedo: { read: [1, 3], bridge: { 3: "In the chapters between, Socrates gives his arguments that the soul is immortal: opposites come from opposites, so the living come from the dead as the dead come from the living; learning is really recollection of what the soul knew before birth (we recognise 'equality itself', which no two sticks perfectly show); and the soul is akin to what is invisible and unchanging. Then the two Thebans raise their objections. Simmias: perhaps the soul is like the tuning of a lyre, which vanishes when the lyre is broken. Cebes: perhaps it is like a weaver who outlives many cloaks but finally dies. The company falls into dismay, and Phaedo breaks the story to tell Echecrates how they all felt. Socrates, stroking Phaedo's hair, warns them against 'misology', hating all argument because some arguments have failed, and answers Simmias. Then he tells his own intellectual story: how he hoped as a young man to learn the causes of things from Anaxagoras and was disappointed, and turned instead to the Forms: a thing is beautiful because it shares in Beauty itself. Today: the final argument, the myth of the true earth, and his death." } },
    meditations: { read: [1, 2], tail: { 2: "The remaining Books (VII to XII) return to the same few themes with new force: the shortness of life and the vastness of time (soon you will have forgotten everything, and soon everything will have forgotten you); the body of humankind to which we belong as limbs; doing the next right action and not asking for thanks, like the vine you met in Book V; and the inner citadel, the mind that no one can enter unless you let them. Book XII ends with an image you should keep: life as a play, and death as the director who dismisses the actor from the stage; and when the actor protests that he has played only three of the five acts, the answer is that in life three acts can be the whole drama. Go back to them at any time from All books." } },
    zarathustra: { read: [1, 2, 4, 5, 7, 10], bridge: {
      4: "In the chapters between (the end of Part One and the opening of Part Two), Zarathustra speaks on marriage and children ('Thou shalt build beyond thyself'), on voluntary death ('Die at the right time'), and on the 'bestowing virtue', a generosity that gives from overflow; he leaves his disciples and tells them to lose him and find themselves. Years pass. He dreams that a child shows him a mirror with a devil's face in it: his teaching is being distorted. He returns to the 'Happy Isles' and attacks pity, priests, the self-satisfied 'virtuous', the rabble, and the 'tarantulas', preachers of equality whose secret motive is revenge.",
      7: "In between, Zarathustra travels home and passes through towns where everything has been made small and comfortable ('the bedwarfing virtue'); he weighs the 'three evil things', voluptuousness, passion for power and selfishness, and redeems them; and he fights 'the spirit of gravity', the heaviness that makes life seem a burden. Today he writes his new values on new tablets and, after seven days of collapse, hears his animals tell him what he is: the teacher of eternal recurrence.",
      10: "In Part Four, Zarathustra, now old, hears a cry of distress and goes out to find the 'higher men' who need him: two kings sick of ruling the rabble, a scholar who has studied only the brain of the leech, an old magician, the last pope (out of service because God is dead), the 'ugliest man' who murdered God because he could not bear to be seen, a voluntary beggar who preaches to cows, and Zarathustra's own shadow. He invites them all to supper in his cave. They are better than the 'last men', but they are not what he waits for. Today: the drunken midnight song, and the sign.",
    } },
    bge: { read: [1, 2, 7], bridge: { 7: "Parts Four to Eight, in brief. Part Four is a firework of aphorisms ('One does not hate as long as one disesteems'; 'Madness is rare in individuals, but in groups, parties, nations and epochs it is the rule'). Part Five, the natural history of morals, argues that moralities are a sign-language of the passions and that European morality is 'herd-animal morality'. Part Six attacks scholars and 'objective' men who have no self of their own, and calls for real philosophers who create values. Part Seven questions 'our virtues', honesty above all, and pity. Part Eight surveys peoples and fatherlands, mocking German nationalism and antisemitism, and hoping for 'good Europeans'. Today: What is noble?" } },
    crime: { read: [1, 2, 3, 4, 8, 10, 11, 13, 14, 16, 18, 19, 20, 21], bridge: {
      8: "In the chapters between: Raskolnikov hides the purse and trinkets under a stone in a courtyard, without even looking inside. A passing woman, taking him for a beggar, gives him a coin, and he throws it into the river. He falls into a fever for days and wakes to find Razumihin caring for him, and money sent by his mother. A house-painter, Nikolay, has been arrested for the murders. Luzhin, his sister Dounia's fiancé, calls on him, and Raskolnikov insults him and throws him out. Then, half mad, he goes out into the city, almost confesses to the police clerk Zametov in a tavern ('And what if it was I who killed them?'), goes back to the murdered woman's flat, rings the bell and asks the workmen about the blood.",
      10: "In between: his mother and Dounia arrive in St Petersburg. Razumihin falls instantly in love with Dounia. Luzhin sends a letter demanding that Raskolnikov not be present when he calls. Raskolnikov is cold and strange with his family, then tender, then cold again, and tells them he gave his money to the widow of a drunken clerk.",
      13: "In between: Luzhin calls on the family, sneers at Raskolnikov and at Dounia's poverty, and Dounia breaks the engagement; Luzhin leaves swearing revenge. Svidrigailov, who once persecuted Dounia, has offered through Raskolnikov to give her ten thousand roubles. Raskolnikov tells his mother and sister not to look for him for a while, and goes to Sonia.",
      16: "In between: Luzhin, humiliated, sets a trap for Sonia: he gives her ten roubles in front of a witness while secretly slipping a hundred-rouble note into her pocket. At the same time her stepmother, Katerina Ivanovna, gives a disastrous funeral dinner for Marmeladov, half pride and half madness, which ends in a quarrel with their German landlady.",
      18: "In between: Katerina Ivanovna, thrown out of her lodgings, takes the children into the street to sing and dance for money, collapses and dies. Svidrigailov reveals that he has rooms next to Sonia's and overheard Raskolnikov's confession through the wall; he offers to pay for the children. Raskolnikov drifts for days in a fog. Razumihin confronts him about Dounia. Then they learn that the painter Nikolay has confessed to the murders.",
    } },
    karamazov: { read: [1, 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 28, 29, 30, 31, 36], bridge: {
      5: "In between: Alyosha is devoted to the elder Zossima at the monastery. The whole family gathers in Zossima's cell, supposedly to settle Fyodor and Dmitri's quarrel over Dmitri's inheritance. Fyodor plays the buffoon. Zossima receives grieving peasant women, one of whom has lost her little son, and an anxious society lady, Madame Hohlakov, to whom he teaches 'active love'. Ivan's article on church and state is discussed, and his idea is reported: if there is no immortality, there is no virtue, and everything is permitted. Dmitri arrives late; the meeting explodes. Then Zossima, to everyone's astonishment, bows to the ground before Dmitri, as if foreseeing great suffering.",
      10: "In between: Dmitri's 'confession of a passionate heart' to Alyosha continues: years ago Katerina Ivanovna ('Katya') came to him in secret for money to save her father's honour; he gave it and let her go; now they are engaged, but he is in love with Grushenka and has spent half of 3,000 roubles Katya trusted to him. We meet Smerdyakov, the sullen servant who is probably Fyodor's son, who argues at dinner that a soldier who renounced his faith under torture would not have sinned. Over brandy Fyodor asks Ivan and Alyosha whether God exists. Dmitri bursts in and beats his father, thinking Grushenka is hiding there. Alyosha finds Grushenka at Katya's, where she humiliates her. Then Alyosha meets schoolboys stoning a sick boy, Ilusha, who bites him; he learns Dmitri once dragged Ilusha's father, Captain Snegiryov, by his beard in the street; he brings the captain two hundred roubles from Katya, and the poor man, out of pride, tramples them.",
      28: "In between, the catastrophe. Mitya tries frantically to raise 3,000 roubles (a merchant sends him on a fool's errand, Madame Hohlakov offers him gold-mines instead of money). At night he hides in his father's garden; Fyodor is at the window, waiting for Grushenka. Mitya flees, and the old servant Grigory catches him at the fence; Mitya strikes him with a brass pestle and leaves him bleeding. He learns Grushenka has gone to the village of Mokroe to her former lover, a Polish officer; with a sudden fortune in his hands he buys wine and races there by troika, planning to see her once more and shoot himself at dawn. At Mokroe the Pole is exposed as a cheat, Grushenka says she loves Mitya, and there is a wild night of celebration, until the police arrive: Fyodor has been murdered and robbed. Mitya is interrogated through the night; he admits he hated his father but swears he did not kill him, and finally reveals his 'shame': the money he spent was half of Katya's, the other half sewn into a rag on his chest. Asleep, he dreams of a starving peasant woman with a baby in a burnt village, and wakes changed. He is taken away. Then the boys: the precocious Kolya Krassotkin, Ilusha dying, the lost dog found, the boys reconciled at Ilusha's bedside around Alyosha. Two months later Grushenka has been transformed by Mitya's arrest.",
      36: "In between, the trial. Witnesses testify. Katya first speaks for Mitya, then, in hysteria, produces his drunken letter as 'mathematical proof' that he planned the murder. Ivan, feverish, shows the court the 3,000 roubles, says Smerdyakov did it and that he himself is guilty, raves about the devil, and is carried out. The prosecutor gives a long, brilliant psychological portrait of the Karamazov nature. The defence lawyer argues there is no proof of the money or of the murder, and that a father like Fyodor was no father. The jury retires.",
    } },
    anna: { read: [1, 2, 3, 4, 10, 12, 19, 20, 25, 35, 37], bridge: {
      10: "In between: Levin goes home to his estate and his work and tries to forget Kitty. Anna returns to St Petersburg; seeing her husband at the station she notices, for the first time, his ears. Vronsky follows her. Kitty, humiliated, falls ill and is taken abroad. In Petersburg society Anna and Vronsky become inseparable; Karenin warns her coldly about appearances. Almost a year after they met, Anna becomes Vronsky's lover; Tolstoy writes the scene as shame and silence. In spring Levin hears from Stiva that Kitty is ill and Vronsky has dropped her. Anna tells Vronsky she is pregnant. Vronsky prepares for the officers' steeplechase on his mare, Frou-Frou. Today: the race.",
      12: "In between: Kitty, at a German spa, makes friends with the selfless Varenka, tries to imitate her goodness and learns that she cannot live by imitation; she goes home recovered. Levin's half-brother, the intellectual Sergey Ivanovich, comes to stay in the country.",
      19: "In between: Levin sees Kitty pass in a carriage at dawn and knows he still loves her. Karenin decides there will be no divorce, only appearances kept up, and Anna, trapped, is in despair; Vronsky is torn between his career and her. Levin throws himself into theories of farming and the peasants, travels abroad, and comes back. In Moscow the triangle of Anna, Karenin and Vronsky grows unbearable, and Karenin decides on divorce. Today: Stiva's dinner party.",
      25: "In between: Karenin agrees to a divorce, but Anna refuses it and leaves for Italy with Vronsky, abandoning her son. Levin and Kitty marry, Levin terrified and happy, unsure up to the altar whether she really loves him. In Italy, Vronsky dabbles in painting, and a real painter, Mihailov, paints a portrait of Anna that shows her as she truly is. Levin's brother Nikolai dies; Kitty, not Levin, knows how to comfort the dying. Kitty is pregnant. In Petersburg, Karenin falls under the influence of the pious Countess Lydia Ivanovna.",
      35: "In between: Anna goes to the opera and is publicly snubbed: society has shut her out. Summer at Levin's estate with Kitty and Dolly; Levin throws out a guest who flirts with Kitty. Dolly visits Anna at Vronsky's estate and finds luxury, cleverness and a deep unease; Anna cannot get a divorce or see her son. In Moscow, Levin meets Anna once and is charmed; Kitty is jealous. Kitty gives birth, and Levin, who does not believe, prays. Stiva tries to obtain the divorce for Anna, but Karenin, led by Lydia Ivanovna's mystic, refuses. Anna's jealousy grows; she quarrels with Vronsky over every small thing; she cannot sleep without opium. Today: her last day.",
      37: "In between: after Anna's death, Vronsky, broken, leaves with a volunteer regiment for the war in Serbia, saying he is good for nothing but to die. Levin, a father now, is tormented by questions about the meaning of life, so much that, happy as he is, he hides ropes and guns from himself. Then a peasant tells him that one man lives for his belly and another 'for his soul, for God'. Today: what Levin understands.",
    } },
  };
  for (const id of Object.keys(ROUTE)) {
    const b = B.find((x) => x.id === id);
    if (b) b.route = ROUTE[id];
  }
  // the order: long and short alternate, so every week finishes something
  const ORDER = ["underground", "apology", "enchiridion", "shortness", "phaedo", "cave", "ridiculous", "overcoat", "meditations", "ladydog", "zarathustra", "bartleby", "symposium", "hamlet", "camus", "bge", "crime", "karamazov", "anna"];
  B.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
})();
/* v18.12 · "Use it today" (owner: "life-changing, same benefits"). Every sitting ends with one small action drawn
   from the book, rotating through the book's list; the action is the point where reading turns into a changed day. */
(function () {
  const APPLY = {
    underground: ["Notice one moment today when you chose spite or pride over what you actually wanted. Name it to yourself, without excuses.", "Do one thing today that someone could predict you would do, and do it fully. Freedom is not only refusal.", "Accept one kindness today without explaining it away.", "Write down a 'Crystal Palace' you believe in (a system that will fix everything). What would the Underground Man say to it?", "Liza offered love and he paid her. Today, give someone something you cannot pay back: attention, time, an apology."],
    apology: ["Ask one person a real question today and keep asking until you both reach the edge of what you know.", "Find one belief you hold only because people around you hold it. Examine it for five minutes."],
    enchiridion: ["Every time something annoys you today, say: 'up to me, or not?' Act only on the first kind.", "Before an exam, a meeting or a hard conversation, rehearse what is up to you and let the rest go."],
    shortness: ["Track today in 30-minute blocks. At night, mark which blocks were truly yours.", "Do the one thing you keep saying you will do 'later', for 20 minutes, today."],
    phaedo: ["Spend ten minutes thinking about your own death calmly, as Socrates did. Notice what suddenly seems unimportant.", "When an argument fails you today, do not give up on reasoning itself. Find a better argument."],
    cave: ["Name one 'shadow' you spent time on today (a feed, a rumour, a fear). Turn away from it once.", "Teach one thing you understand well to someone who doesn't yet, patiently, even if they laugh."],
    ridiculous: ["Help one person today who asks, even if you are tired of everything.", "Love others as yourself for one hour today, in small acts. Notice how it changes the hour."],
    overcoat: ["Speak kindly to the person in your world whom everyone overlooks.", "Before you mock someone today, remember 'I am your brother'."],
    meditations: ["Tomorrow morning, before you get up, say: 'I am getting up to do the work of a human being.'", "Tonight, write your own Book I: three people, and what each taught you."],
    ladydog: ["Look closely at one ordinary person today as if they were the centre of a story.", "Notice one moment when you are bored and cynical. Ask what you are protecting yourself from."],
    zarathustra: ["Name one value you live by that you never chose. Keep it or change it, but choose it today.", "Do one hard thing today for no audience: the camel's discipline that makes the lion possible.", "Look at your day and ask: would I live this exact day again, forever? Change one hour so the answer is yes.", "Write a 'new tablet': three rules you choose for yourself.", "Spend ten minutes doing something you are bad at, on purpose, to grow.", "Say yes to one thing today you would normally complain about."],
    bartleby: ["Notice one thing you do only because it is expected. Would you 'prefer not to'? Decide honestly.", "Check on someone who has gone quiet."],
    symposium: ["Tell someone today, specifically, what you admire in them.", "Ask: what am I really longing for, under what I say I want?"],
    hamlet: ["Is there something you keep thinking about instead of doing? Take the first concrete step today.", "Before a decision, write: 'The readiness is all.' Prepare well, then act."],
    camus: ["Do your most repetitive task today with full attention, as Sisyphus walking down the mountain.", "Say no to one thing that crosses your line today, and notice the yes inside the no.", "Do one decent thing today that nobody will see. That is The Plague's whole moral."],
    bge: ["Pick one moral judgement you made today and ask: what does it confess about me?", "When you fight something today, check you are not becoming it."],
    crime: ["Catch one moment today when you tell yourself a clever story to justify something. Write the honest version.", "Notice one person who carries a heavy burden quietly, as Sonia does. Make their day lighter.", "Be the Razumihin today: loyal, practical, cheerful help for a friend."],
    karamazov: ["Do one act of 'active love' today: concrete, small, for someone specific.", "When you hear 'everything is permitted' in your head today, answer it with one action.", "Remember one good childhood memory. Alyosha says one such memory can save a person."],
    anna: ["Notice whose point of view you never take. Take it for five minutes today.", "Do one physical task today wholeheartedly, as Levin mows: lose yourself in it.", "Ask Levin's question at the end of the day: did I live for my belly, or for my soul?"],
  };
  for (const b of window.RN_BOOKS || []) if (APPLY[b.id]) b.apply = APPLY[b.id];
})();
