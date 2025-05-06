package com.uiktp.config.database;

import com.uiktp.model.Course;
import com.uiktp.model.FlashCard;
import com.uiktp.model.Semester;
import com.uiktp.model.User;
import com.uiktp.model.enumerations.UserRole;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.FlashCardRepository;
import com.uiktp.repository.SemesterRepository;
import com.uiktp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

        private final UserRepository userRepository;

        private final SemesterRepository semesterRepository;

        private final CourseRepository courseRepository;

        private final FlashCardRepository flashCardRepository;

        private final PasswordEncoder passwordEncoder;

        public DatabaseSeeder(UserRepository userRepository, SemesterRepository semesterRepository,
                              CourseRepository courseRepository, FlashCardRepository flashCardRepository, PasswordEncoder passwordEncoder) {
                this.userRepository = userRepository;
                this.semesterRepository = semesterRepository;
                this.courseRepository = courseRepository;
            this.flashCardRepository = flashCardRepository;
            this.passwordEncoder = passwordEncoder;
        }

        @Override
        public void run(String... args) {
                User student = new User(
                        "Example Student",
                        "student@gmail.com",
                        passwordEncoder.encode("student123"), 
                        UserRole.USER,
                        "211123"
                );
                if (!userRepository.existsByEmail("student@gmail.com")) {
                        userRepository.save(student);
                }

                for (int i = 1; i <= 8; i++) {
                        Semester semester = new Semester();
                        semester.setName("Semester " + i);
                        semester.setStudent(student);
                        if (!semesterRepository.existsByName("Semester 1")) {
                                semesterRepository.save(semester);
                        }
                }

                List<Course> courses = List.of(
                                new Course(
                                                "Business and Management",
                                                "Developing managerial skills: technical, conceptual, communication, analytical. Adoption of frameworks, concepts, models and techniques in the field of management. Presentation and analysis of case studies and best management practices from multiple business areas and case studies of individual businesses."),
                                new Course(
                                                "Introduction to Computer Science",
                                                "The goal of this course is to obtain a solid knowledge of the basics of information and communication technologies, their creation, the current and future trends; the way computers work, the basics of the Web, image processing, video and animations; key areas of information and communication technologies and their impact: the ability to manipulate text, tables, graphs, images, audio and video."),
                                new Course(
                                                "Calculus",
                                                "This course is a support course that is essential for introducing the terms of a function, limits, derivate and integrals. These terms are important for almost all courses in the following years."),
                                new Course(
                                                "Professional skills",
                                                "The aim of the course is to provide the students with the skills necessary for academic writing and presentation, by caring about the ethics and critical thinking. After completion of the course it is expected from the student to be able to write quality academic texts (paragraph, essay, CV, formal letter) both in Macedonian and English language; to differentiate between different technical texts (specification, report, study, technical documentation) and to identify their parts; to give effective 15 minutes presentation on given topic in English language and to reply to the given questions about the presentation."),
                                new Course(
                                                "Structural programming",
                                                "To introduce the students to the Structured programming paradigm, to understand the concept of algorithms and to enable them to develop algorithms, to code, test and compile programs. There will be introduction of data types, control structures, functions, arrays and files."),
                                new Course(
                                                "Computer Architecture and Organization",
                                                "Understanding the main parts of computer architectures, internal organization, performance evaluation of individual parts and the computer system in whole."),
                                new Course(
                                                "Discrete Mathematics",
                                                "To introduce students to basic mathematical concepts as a foundation for the following courses in information technologies, computer and software engineering."),
                                new Course(
                                                "Object Oriented Analysis and Design",
                                                "Introduction to the techniques that are necessary for analysis, design and modeling of object-oriented systems. Enabling practical analysis of user requirements and creating effective OO models as the initial phase of implementation of the OO system."),
                                new Course(
                                                "Object oriented programming",
                                                "The goal of the course is to acquaint the student with the basic concepts of object-oriented programming. Therefore, the concepts of classes and objects will be introduced, encapsulation, inheritance and polymorphism. The students will be introduces to the concept of hierarchy of classes. Comparisons will be made of the implementation of the object-oriented concepts in different programming languages. After the completion of the course, the student will understand the principles of object-oriented programming and will be able to develop programs based on these concepts and principles."),
                                new Course(
                                                "Calculus 2",
                                                "This course is a support course. It introduces the terms of an integrals, application of integrals, sequences and series which are important for advanced courses."),
                                new Course(
                                                "Computer Components",
                                                "Knowledge of the structure of computer systems, hardware components, connection and the way of work, characteristics and standards used."),
                                new Course(
                                                "Puzzle based learning",
                                                "The student will gain the ability for critical thinking and develop skills necessary to cultivate the thinking outside the box principles. Will be able to place the problem in the correct frame, construct it properly, and solve unstructured problems. Will have enhanced skills necessary for general problem solving that stimulate logical thinking."),
                                new Course(
                                                "Marketing",
                                                "Introduction to the main elements for developing a marketing strategy and planning a marketing program; Development of skills to solve marketing problems through analytical tools (frameworks, concepts, models and techniques); Examples of case studies how enterprises are organizing their marketing operations, with an emphasis on ICT enterprises; Improving communication skills, oral and written, team work in the preparation of a project task, presenting the project task."),
                                new Course(
                                                "Fundamentals of web design",
                                                "Upon completion of the course, students are expected to gain introductory knowledge for developing web pages with contemporary design, by using the HTML and cascading styles. The students are expected to: 1. Demonstrate a basic understanding of the importance of good website design. 2. Demonstrate practical knowledge about web design technologies and apply knowledge in basic designing of web sites. 3. To communicate by the usage of terminology specific to this area. 4. Critically evaluate examples of web sites."),
                                new Course(
                                                "Cybersecurity for Beginners",
                                                "The student will understand the concept of cyber security, threats and risks. Will be aware about the problems related to cyber crime and will be able to understand the risks of attacks and the basic mechanism for protection."),
                                new Course(
                                                "Algorithms and Data Structures",
                                                "Introduction to basic data structures and algorithms needed to understand different technologies (e.g. databases, application development frameworks). Students will be able to develop algorithms using f data structures such are: lists, trees, graphs, as well as searching indexes. Student will be able to implement different algorithms' archetypes which are used in implementation of many software solutions."),
                                new Course(
                                                "Probability and statistics",
                                                "Students will be introduced to basic concepts of probability and statistical analyses with their application in computer sciences. The knowledge of this subject is solid support for advanced courses where elements of probability and statistics are applied."),
                                new Course(
                                                "Computer Networks and Security",
                                                "Introduction to the basic concepts of computer networks and security. The student will acquire knowledge related to the network architecture, network protocols, and networking, as well as the main concepts of network security. The student will get acquainted with the main components and applications of the TCP / IP protocol suite."),
                                new Course(
                                                "Economy for ICT engineers",
                                                "ICT engineers, designing and offering ICT services, face questions about SLAs, vendors, suppliers, the financial aspects of ICT services - how much the service should be priced, why exactly that much , how much are the costs, how much they are allowed to cost, etc.. The areas that need to be introduced are budgeting, bookkeeping, pricing, financial planning, financial analysis and reporting. This course has the task of helping them to master these areas through a description of the underlying economic models; demonstrating how these models work; description of the main economic phenomena using economic models."),
                                new Course(
                                                "Engineering mathematics",
                                                "The course covers methods for numerical solving of many mathematical problems and application of some significant mathematical transformations in engineering."),
                                new Course(
                                                "Client side Inernet programming",
                                                "The purpose of the course is to enable students to familiarize themselves with the Internet client side programming. In this regard, students will be introduced to some of the client side programming languages and technologies. Upon completion of the course, the student is expected to be able to develop interactive web pages using programming languages for client side programming."),
                                new Course(
                                                "Advanced programming",
                                                "The student will attain knowledge of generic programming, abstract data types, creation of template classes and functions. After completing the course, the students will be capable for using generic data collections, maps, iterators and basic design patterns for rapid object oriented software development."),
                                new Course(
                                                "User support",
                                                "After finishing the course, the student is expected to understand the methods and systems for solving IT related problems through providing a high quality technical support"),
                                new Course(
                                                "User interfaces design patterns",
                                                "The purpose of the course is to introduce basic problems of user interfaces and approaches of solving them for different types of user interfaces and user interaction. Upon completion of the course, the student is expected to demonstrate knowledge of the basic principles of effective and efficient user interaction and the principles for their design, and can independently develop interactive applications using programming tools following the learned principles."),
                                new Course(
                                                "Software requirements analysis",
                                                "After finishing this course, the student is expected to understands and have deepened knowledge in application of knowledge extraction from his client, to understands techniques for documenting software and business needs, to understands and have deepened knowledge in application of techniques for change management in software and business requirements."),
                                new Course(
                                                "Operating systems",
                                                "The student will be introduced into the basic building blocks of modern operating systems through their specific implementation in Windows and UNIX-like systems."),
                                new Course(
                                                "Wireless mobile systems",
                                                "Using and understanding the wireless mobile communication systems"),
                                new Course(
                                                "Artificial Intelligence",
                                                "Upon successful completion of the course, students will have an understanding of the basic areas of artificial intelligence including search, problem solving, knowledge representation, reasoning, decision making, planning, perception and action, and learning -- and their applications. Students will also be able to design and implement key components of intelligent agents of moderate complexity and evaluate their performance."),
                                new Course(
                                                "Visual programming",
                                                "The student will attain knowledge of software development techniques by using modern object-oriented programming language in advanced integrated development environment, designing user interfaces and software debugging. After completing the course, the students will be capable for developing event-driven application, graphical user interfaces, advanced forms for user input, custom user controls and creating installation packages."),
                                new Course(
                                                "Introduction to Ecoinformatics",
                                                "Ecoinformatics is the science of information (informatics) in ecology and environmental science. It integrates environmental and information science to define entities and natural language processes common to people and computers. EcoInformatics aims to facilitate research and management of the environment by developing ways of accessing, integrating environmental information databases and developing new algorithms that allow the combination of different environmental databases to test the environmental hypotheses"),
                                new Course(
                                                "Introduction to Stochastic Processes",
                                                "Students will be able for modelling of stochastic processes in real situations."),
                                new Course(
                                                "Digital image processing",
                                                "Upon the completion of the course the student is expected to rule and use the basic tools and methods for image processing."),
                                new Course(
                                                "Algorithm design",
                                                "Upon completion of this course, students will become familiar with major algorithms and data structures and he will be able to apply important algorithmic design paradigms and methods of analysis and synthesize efficient algorithms in common engineering design situations. He will also learn to analyze the asymptotic performance of algorithms, and check the correctness of algorithms."),
                                new Course(
                                                "E-government",
                                                "The students will be introduced to the delivery of services by government institutions to the beneficiaries: citizens, businesses and organizations from the non-governmental sector and the application of information technologies in those processes; they will get acquainted with advanced countries and advanced areas of e-government application through number of case studies and best practices. The course will encourage development of communication skills, oral and written, team work skills in the preparation of a project task, presenting skills through the project task presentations."),
                                new Course(
                                                "Electric Circuits",
                                                "Introduction to the basic concepts and phenomena of electric circuits, basic laws and theories in the theory of electric circuits and some methods for analyzing electrical networks with time constant and time-varying currents and voltages. Using the basic laws in electrical engineering in solving specific problems in engineering."),
                                new Course(
                                                "Internet technologies",
                                                "Knowledge of the mechanisms in the HTTP protocol. Introduction to Internet Application Development Platforms. Creating and developing web apps. Creating and using web services."),
                                new Course(
                                                "Computer graphics",
                                                "The purpose of the course is to familiarize students with theoretical fundamentals and concepts of 2D and 3D computer graphics, geometric modeling, transformations, rendering and generating curves and surfaces using splines. The practical implementation of the algorithms will be realized by OpenGL. Upon finishing of the course, the student is expected to demonstrate knowledge of the theoretical fundamentals and concepts of 2D and 3D computer graphics, use OpenGL library and graphic software packages for practical implementation of computer graphics problems."),
                                new Course(
                                                "Concepts of Information Society",
                                                "The aim of the course is to present the students the theories and approaches that analyze the role of the information technology, medias and the knowledge in the modern society. After the course, students will be available: 1. To discuss systematically and critically, to evaluate and analyze the main topics, principles, concepts and theories of information society 2. To apply different concepts of the information society 3. To show understanding the information technology and knowledge importance for the modern society"),
                                new Course(
                                                "Media and Communications",
                                                "After the course, the student will be able to understand fundamental topics from communication as science, and have deeper knowledge of how to apply contemporary techniques and findings in order to increase the achieved quality of communication among communication stakeholders. Special focus will be given to new media, and how they fit in different sociological environments. Students will be introduced to basic principles of analyses of public opinion and usage of social media to create and promote brands (personal or cooperate)."),
                                new Course(
                                                "Information theory and digital communications",
                                                "Students will become familiar with the quantitative information theory and its application in reliable and efficient communication systems. Additionally, they will be introduced in the mathematical model of the communication system."),
                                new Course(
                                                "Databases",
                                                "Introducing the student with the basic concepts for using the databases; the ways of their modeling and implementation; as well as the application of the query languages. The student will be able to model databases through semantic and relational modeling and database normalization, he/she will know how to practically apply the SQL standard for creating, maintaining and manipulating relational databases. The student will have knowledge of the basic concepts of concurrency control and transactions."),
                                new Course(
                                                "Introduction to Data Science",
                                                "Students will obtain knowledge with the Data Science fundamentals and they will be introduced to the process and methodologies for operations with data, starting from problem identification, data collection and data processing. At the end of the course students would know the basic techniques for data processing and pattern recognition in the data, as well as, they will know how to visualize the results and properly interpret them."),
                                new Course(
                                                "Software Design and Architecture",
                                                "Students should learn the main concepts of the object oriented analysis and design. To introduce the students to the techniques of refactoring, design patterns and different software architectures. Upon completion of the course the students will be able to identify the restrictions and assess the quality of the software systems. They will be able to evaluate completeness and consistency of software specifications, and to design software architectures according the specific needs."),
                                new Course(
                                                "System administration",
                                                "System administration represents a complex process of operational management of system and software components in computer systems, in order to provide secure, reliable and available services to users. Organization of the process of system administration is diverse and includes activities relaed to management of operating systems, networking services as well as application and other server systems."),
                                new Course(
                                                "Web Programming",
                                                "Web application development, using the MVC pattern. The students will learn to develop web applications and web services, to connect to and use databases. They will learn to develop security mechanisms for web applications, and test the developed web applications."),
                                new Course(
                                                "Visualization",
                                                "The aim of the course is to familiarize students with the concept of data visualization, selection of techniques and algorithms for visualization of different data sets, and their program implementation. Upon completion of the course is expected the student to demonstrate knowledge of the concept of data visualization, knowledge how to select and implement algorithms for visualizing different data types by programming or by using visualization tools."),
                                new Course(
                                                "Information security",
                                                "Learning the concepts related to Information Security; procedures and methods for securing computer systems; methods used to increasing the level of security."),
                                new Course(
                                                "Computer ethics",
                                                "Upon successful completion of this course, the student will be able to: - recognize the key cultural, social, legal and ethical issues of ICTs and their influence, as well as the professional responsibilities of ICT professionals; - understand the importance and critically discuss the potential ICT risks, including the consequences of ICT's fast development and its impact to humanity; - gather information about national and international laws responsible for the prevention and protection against computer crime."),
                                new Course(
                                                "Computer audio, speech and music",
                                                "Physics of acoustic waves. Components of human speech. Speech systems and mathematical models. Speech analysis and synthesis. Speech recognition overview. Speaker recognition. Language identification. Speech tone. Prosody. Sound and melody mixing and editing. Spectra of musical instruments. Introduction to tonal music theory. Symbolic music representation (MIDI, MusicXML). Computer generated sounds and music. Music search."),
                                new Course(
                                                "Linear algebra and applications",
                                                "In this course you will learn the concepts and methods of linear algebra, and how to use them to think about problems arising in computer science."),
                                new Course(
                                                "Multimedia Networks",
                                                "The main goals of the course is to introduce the students to the properties of multimedia contents which are essential for their distribution, the mechanisms for distribution of multimedia from perspective of the network protocols, the problems that might occur during their delivery, the solutions for improving the quality of service and the various content distribution platforms. The students will get skills to to analyse the multimedia contents, adapt them for distribution in various network conditions and host them on dedicated video servers."),
                                new Course(
                                                "Advanced Web Design",
                                                "The goal of the study program is for the students to be acquainted with the advanced technologies in the area of Web Design and modern dynamic web applications. After completion of the course, the students will have an overview of the newest technologies in the area of web design and will be capable of using them in the development of practical projects."),
                                new Course(
                                                "Introduction to robotics",
                                                "After finishing this course, the student is expected to have knowledge of development principles of robots and systems including sensors and effectors. Students will be introduced with methods of robot programming enabling their operation. Students will be introduced with application of robots in the industry and society."),
                                new Course(
                                                "Human-computer interaction design",
                                                "The purpose of the course is to introduce the basic principles for designing interactive computer systems to students. For this purpose the process of designing interactive systems, design phases (collection and analysis of requirements, prototyping, implementation and usability testing) will be introduced to students. Upon completion of the course, the student is expected to demonstrate knowledge of the process and phases for designing interactive systems and can independently or in a team design and implement a prototype of interactive system."),
                                new Course(
                                                "Integrated Systems",
                                                "After completing the course, it is expected for students to be able to design, select, implement and manage enterprise IT solutions. To be capable of working in a corporate environment while implementing and maintaining enterprise IT solutions. To be capable of developing strategies for technological architectures of complex software systems serving wast amounts of data, many users and wide specter of business processes."),
                                new Course(
                                                "Software quality and testing",
                                                "The goal of this course is to understand the need for software testing, different techniques of software modeling, and using those models for testing. Also, practical software testing, verification, and validation are the goals of the proposed course."),
                                new Course(
                                                "Agent-based systems",
                                                "Agent based modeling offers a natural metaphor for explaining phenomena in the natural and social sciences, ranging from evolution to epidemic spread to racial segregation and forming coalitions.. Many systems can be modeled as being composed of self-interested or altruistic agents interacting with their environment and one another: cooperating, negotiating, competing or forming coalitions. Very simple rules governing agent (micro) behavior can lead to complex and emergent phenomena (macro-level).The aim of this course is to introduce students to the agent paradigm suitable for modeling systems in different domains (e.g., games, robots, social behavior). After completion of the course the student will be able to design and implement single- and multi-agent systems using suitable tools and platforms."),
                                new Course(
                                                "Wireless Multimedia Systems",
                                                "Understanding the issues arising from transferring multimedia over wireless and mobile networks. Getting familiar with the concepts of design, analysis and implementation of wireless and mobile multimedia systems. Learning multimedia coding techniques, multimedia transport protocols in wireless networks, multimedia control protocols in wireless networks. Learning multimedia traffic specifics. Being able to practically provide multimedia application QoS for wireless mobile devices."),
                                new Course(
                                                "Embedded microprocessor systems",
                                                "Students shall gain familiarity with embedded systems hardware, software and systems design. They will understand the importance of the hardware-software interaction, and interfacing with sensors and actuators. They will gain familiarity in programming embedded systems in both assembly and a high-order language. The students will be able to define and execute architectural trade-offs, including hardware and software needed to build a modern embedded system."),
                                new Course(
                                                "Virtualization",
                                                "Introduction to virtualization as a paradigm for creation of virtual computer systems using software virtualization of hardware components. Analysis of different aspects of virtualization, technologies and techniques included in the process, as well as advantages and disadvantages introduces by using virtualization."),
                                new Course(
                                                "Introduction to network science",
                                                "Students will be introduced to concepts in Network Science on real data. At the end of the course the student would be able to analyze different properties and dynamical processes in real complex networks, and they would be able to model and visualize networks and dynamical processes on networks. Students throughout the course will learn the basic methods for community detection, robustness evaluation, network optimization, data mining and prediction in networks."),
                                new Course(
                                                "Geographic Information Systems",
                                                "Creation and management of spatial (Geographic) information system."),
                                new Course(
                                                "Digital Forensics",
                                                "After finishing the course student will know the fundamental principles and techniques needed to carry out digital forensic investigation. Student will obtain practical knowledge to work with different forensic tools for different operating systems."),
                                new Course(
                                                "Electronic and Mobile Commerce",
                                                "The student upon completion will acquire the skills to develop applications for ecommerce and m-commerce. Developing e-business plans."),
                                new Course(
                                                "DevOps",
                                                "Getting familiar with the basic concept of development and operations (DevOps) through continuous integration, testing, delivery and deployment of software solutions and systems. Learning about the different perspectives of the development (Dev) and operations (Ops) part of a system's life-cycle. Enabling students to use tools for automating the processes of integration, testing, delivery and deployment. Learning about the challenges and best practices in managing software releases and configuration."),
                                new Course(
                                                "Machine learning",
                                                "The aim of the course is for the students to become familiar with the basics of modern machine learning techniques. Upon completion of the course, candidates will have deeper knowledge of advanced technologies and methods of machine learning; they will be able to understand, analyze and formulate general problems in the field of machine learning; they can successfully apply algorithms for machine learning in solving real problems; will be able to conceptualize, analyze, realize and evaluate the performance of a machine learning system."),
                                new Course(
                                                "Multimedia systems",
                                                "Introducing the student with the basic concepts for working with multimedia data, the ways of their modeling and implementation and manipulation of them. The student will be able to model multimedia data, will know how to practically apply the content-based search on multimedia data, and will gain initial knowledge for creating applications based on multimedia content."),
                                new Course(
                                                "Parallel programming",
                                                "Research of the algorithms and programming techniques of the newest parallel platforms with shared and distributed memory. The student will learn the theoretical and practical (programmatical) components."),
                                new Course(
                                                "Data mining",
                                                "Introduction to methods for identifying valid, novel, useful, and understandable patterns in data. Data preprocessing Induction of predictive models from data: classification, regression, probability estimation. Discovery of clusters and association rules."),
                                new Course(
                                                "Signal processing",
                                                "Knowledge of the basic techniques for digital signal processing is important for every engineer who works on applications where any signal processing is involved. Within this course the students are introduced to the theoretical grounds of digital signal processing which include discretization, Fourier and Z-transform. The students will gain knowledge for basic tools like the digital IIR and FIR filters. Within this course are also included the basics of the control theory. Through numerous examples and exercises the students will learn to use tools for signal processing."),
                                new Course(
                                                "Service Oriented Architectures",
                                                "The students studying Service Oriented Architectures will learn the organization, design and development of distributed systems based on services. Service-oriented architectures course covers topics of software and system engineering. From the aspect of software engineering, the students will learn the process of analysis and design of service-oriented applications, as well as organization of the process of development of software adequate for service-oriented systems. From aspect of system engineering, the course covers the entire ecosystem of service-oriented and micro-service oriented architecture, its components, collaboration, communication and coordination."),
                                new Course(
                                                "Software defined security",
                                                "Understand and apply key concepts from developing secure software in terms of data, authentication, authorization, and secure web applications."),
                                new Course(
                                                "Statistical modelling",
                                                "The students should learn how to make the statistical analysis of data, using the classical and Bayesian approach. They should set suitable statistical models and check and interpret the obtained results. The accent will be on the use of open source software (R, Python) for building models based on real data, using the presented theory. The course should prepare the students for data analysis in different research fields."),
                                new Course(
                                                "Formal languages and automata",
                                                "The purpose of this course is to acquaint the student with an overview of the theoretical foundations of computer science from the perspective of formal languages. - Classify machines by their power to recognize languages. - Employ finite state machines to solve problems in computing. - Explain deterministic and non-deterministic machines. - Comprehend the hierarchy of problems arising in the computer sciences."),
                                new Course(
                                                "Autonomous robotics",
                                                "After finishing this course, the student is expected to have advanced knowledge in the development of autonomous robotics systems (autonomous vehicles, drones etc.) by using probabilistic approaches in robotics."),
                                new Course(
                                                "Database administration",
                                                "This course focuses on the state-of-the-art technologies connected to implementation of data bases. Technologies and techniques that are used for implementation of databases will be covered from both user and system administration aspects. From the aspect of system engineering, the course will dive deep into the concepts and algorithms for: transaction processing, concurrency control, representation of log and metadata, security policies in databases, techniques for replication and distribution, backup and restore."),
                                new Course(
                                                "Information Systems Analysis and Design",
                                                "Students will be introduced with contemporary techniques for information systems analyses and design. Presentation of different recent case studies for information system design and implementation methodologies. They will be able to perform practical user requirements analyses and crate effective models in different phases of information system development, with focus on analyses and design phases. After the course, the student will be able to demonstrate knowledge of novel approaches in the process of information system analyses and design."),
                                new Course(
                                                "Web Based Systems",
                                                "Learning and using the technologies of the Semantic Web and Linked Data. The students will learn how to develop intelligent applications based on Linked Data, and discover and use Open Data datasets."),
                                new Course(
                                                "Introduction to Bioinformatics",
                                                "The goal of the course is to get the students to become acquainted with the areas and problems that cover bioinformatics, to be able to perform gene and protein sequential analysis, to use biological bases data, to learn computational methods for solving problems in the molecular biology."),
                                new Course(
                                                "Introduction to Smart Cities",
                                                "The goal is to familiarize the student with the main concepts, topics and trends of smart and sustainable cities, the role of information in the design of network resources and the impact on urban design, development and urban living."),
                                new Course(
                                                "Introduction to Pattern Recognition",
                                                "To introduce the students to the basic concepts of the methods and techniques of pattern recognition. Upon completion of the course the students will be able to design, implement and effectuate systems for automatic pattern recognition, their performance evaluation and optimization."),
                                new Course(
                                                "Digital Post-production",
                                                "After completion of the course it is expected for the students to be capable of using basic methods for digital postproduction, digital compositing, work with sequences of images, integration of digital objects into footage, motion tracking and match-move object from different sources."),
                                new Course(
                                                "Implementation of Free and Open Source Systems",
                                                "After completion of the course it is expected for the students to be capable of productive participation in bigger software teams working using free and open source technologies. To be capable of working with programming languages with open source, to develop web applications on those platforms. To be capable of managing software projects based on technologies with free and open source."),
                                new Course(
                                                "Innovation in ICT",
                                                "Understanding innovation. Acquiring innovative skills. Application of ICT for creating innovations. Creating innovation in ICT."),
                                new Course(
                                                "IoT",
                                                "Students will obtain knowledge about the main development steps and challenges when designing Internet of Things based solutions. At the end of the course students can model, design and implement IoT systems in different application domains."),
                                new Course(
                                                "Machine Vision",
                                                "The goal of this course is to introduce the students to the basic concepts and principles of computer vision. The students who will successfully finish the course will be able to design efficient systems for computer vision for handwriting recognition, detection and recognition of faces, movement detection, human and vehicle tracking, gesture recognition, classification and recognition of visual objects, scene analysis and understanding etc."),
                                new Course(
                                                "Management Information Systems",
                                                "After completing the course, the students will have knowledge about the different types and usages of management information systems."),
                                new Course(
                                                "Research methodology in ICT",
                                                "The aim of the course is for students to become familiar with the basics of research methodologies in ICT. Upon completion of the course, candidates will have a deeper knowledge of ICT research methodologies, can conceive and conduct scientific research, and write a report on scientific research."),
                                new Course(
                                                "Mobile Information Systems",
                                                "After finishing this course, the user is expected to have broadened knowledge in the application of technologies and data storage, acquisition and processing tools in distributed and ubiquitous environment on different mobile platforms."),
                                new Course(
                                                "Mobile platforms and programming",
                                                "After the successful completion of the course, the student will understand and be able to deploy knowledge of mobile operating systems, native mobile application programming and mobile web programming."),
                                new Course(
                                                "Advanced Human Computer Interaction",
                                                "The students will be acquainted with the basics of the complex interaction between the human and the computer. They will gain knowledge in the techniques for modeling the users, the, problems, the applications and the ambient. They will also learn the techniques for evaluation and analysis of intelligent interfaces. Students will be familiarized with the principles of building interfaces that encompass the limitations of the two affected groups: human and computer. Students will learn that the user is one of the main elements in crating computer systems. They will gain insight in hardware and software development for different user groups, as well as for specific application domains. Students will be familiarized with the principles for building user interfaces adaptable to the environment, agent based intelligent user interfaces, context sensitive interfaces, and intelligent solutions for specific user groups."),
                                new Course(
                                                "Natural language processing",
                                                "The goal of the course is for the students to acquire basic theoretical and practical knowledge of algorithms for processing of natural languages. They will acquire knowledge of how language structure and meaning are represented in data structures, how these structures and meaning can be recognized in textual data, and most important of all, how to build algorithms for recognizing true answers among great number of options."),
                                new Course(
                                                "Operations research",
                                                "The goal is to familiarize the student with the problems and methods in the field of operations research, problems of resource and project optimization and optimal management, with methods and techniques of linear and nonlinear programming, decision making theories and games, operations research related to management information systems and information systems for decision making and prediction."),
                                new Course(
                                                "Cloud computing",
                                                "This course will provide the student with basic knowledge about the concept of cloud computing and cloud services."),
                                new Course(
                                                "Video games programming",
                                                "The purpose of the course is to introduce students to the process of video game programming. For this purpose students will be introduced to the basic components of video games and video game programming approaches. Upon completion of the course, the candidate is expected to understand the concepts for video games programming and to be able to program alone or in a team simple video game."),
                                new Course(
                                                "Programming paradigms",
                                                "Целта на овој курс е запознавање на студентите со програмски парадигми\n"
                                                                +
                                                                "различни од императивната и објектно-ориентираната, со фокус на\n"
                                                                +
                                                                "декларативната и функционалната програмска парадигма. По завршувањето на\n"
                                                                +
                                                                "курсот студентите треба да бидат способни да: Споредуваат различни програмски\n"
                                                                +
                                                                "парадигми и да изберат соодветна за даден проблем, Користат логички\n"
                                                                +
                                                                "програмски јазик за имплементација на ефикасни алгоритми, Користат логички\n"
                                                                +
                                                                "програмски јазик за репрезентација и манипулација со знаење, Користат\n"
                                                                +
                                                                "функционален програмски јазик за пишување на програми без странични ефекти,\n"
                                                                +
                                                                "Разбираат и користат функции од прв и повисок ред, функционални затворања,\n"
                                                                +
                                                                "мрзлива евалуација и апстракција на секвенци, Разбираат и пишуваат едноставни\n"
                                                                +
                                                                "конкурентни програми"),
                                new Course(
                                                "Mining Massive Data Sets",
                                                "The course will introduce the students data mining and machine learning algorithms for analyzing massive amounts of data. The emphasis will be on the distributed platforms and Map Reduce as a tool for creating parallel algorithms that can process large amounts of data."),
                                new Course(
                                                "Decision support systems",
                                                "This course is an introduction to the application of data analysis for making business decisions. The aim of the course is students to become familiar with the methods, techniques and decision support systems, as well as analysis of the decisions. To become familiar with the techniques for acquiring knowledge and representing knowledge. After completion of the course, students will gain knowledge of how to use decision support systems, how to properly choose an appropriate decision support system in a given business context, as well as to design, develop and manage decision support systems."),
                                new Course(
                                                "Software for embedded systems",
                                                "Students will obtain knowledge to create applications for microcontrollers that will work with I/O devices. Students will be able to implement and manage different software configurations."),
                                new Course(
                                                "Software defined networks",
                                                "Upon completion of the course, the student will understand the architecture of software defined networks and network function virtualization. He/she will have knowledge on software access to networks, converged networks technologies, and the separation of the control and data plane, as well as hardware from the software."),
                                new Course(
                                                "Social media networks",
                                                "The objectives of this course for students are as follows: Understand to the basic concepts of social network analysis Collaborative with peers to apply these methods to a variety of social media Understand the link between qualitative and quantitative methods of social network analysis Understand how these social technologies impact society and vice versa"),
                                new Course(
                                                "ICT Project Management",
                                                "After completion of the course, the student is expected to understand and have broader knowledge in applying the techniques and methods for managing ICT projects. To have indepth knowledge in managing software and system requirements, project monitoring and evaluation metrics. To know to apply tools for managing various project interest groups, analyze and manage the project costs, and to prepare management reports. To use software tools for project life-cycle management."),
                                new Course(
                                                "Biology inspired computing",
                                                "The goal of this course is to introduce students to algorithms inspired by naturally appearing phenomena and their application in solving problems in optimization, design and learning. The focus will be on algorithms abstraction from the observed phenomena, analysis and comparison of their results. Within the course special attention will be given to specific applications to the aforementioned algorithms. Upon completion students should acquire the following: - Knowledge of naturally occurring phenomena that are the inspiration for the learned algorithms - Understanding of the strengths and weaknesses of learned algorithms - Ability to identify the appropriateness of learned algorithms and their application to problems of optimization, design and learning"),
                                new Course(
                                                "Blockchain and cryptocurrencies",
                                                "The purpose of this course is to enable trainees to understand how block chains and crypto currencies work, and the idea, the technologies and organizations that support or emanate from them."),
                                new Course(
                                                "Web search engines",
                                                "The goal of the course is to get familiar with concepts for developing web retrieval systems. Understanding ways to process questions and retrieval data sets, as well as ways to automatically gather data from the web. After completing the course, the student is expected to demonstrate knowledge of methods for processing queries, document representation, indexing and classification, to demonstrate knowledge of methods for retrieval and indexing images and to be able to develop retrieval algorithms independently using developer tools."),
                                new Course(
                                                "Virtual reality",
                                                "The course should introduce students with the concept of virtual reality, the different types of virtual environments, input-output devices, as well as basic programming techniques for designing and development of virtual environments. Upon completion of the course, the student is expected to understand the concept of virtual reality, to be able to describe the characteristics of different types of virtual environments and have basic knowledge about designing and developing virtual worlds."),
                                new Course(
                                                "Introduction to cognitive sciences",
                                                "Целта е да се разбере како работи човечкиот мозок. Студентите ќе се запознаат со теоретските и емпириските погледи кои ја дефинираат когнитивната наука. Ќе се запознаат со истражувањата за природата на менталните процеси како перцепцијата, мислењето, меморијата, фантазијата, вниманието, јазикот, интелигенцијата, донесувањето одлуки и решавањето проблеми. Студентите ќе научат кои се алатките превземени од експерименталната психологија, наука на развојот, комјутерската наука, лингвистика, визуализацијата, филозофијата, антропологијата, бихевиоризмот, неврологијата. Курсот ќе ги поврзе сите овие пристапи кои се поврзуваат во когнитивната наука."),
                                new Course(
                                                "ICT for Development",
                                                "The primary goal of the course is to study the fundamentals and best practices of usage of the technology for development. The students will understand the concept of sustainable development that includes the impact on nature and society. Students will be aware of the 17 goals for sustainable development defined by the United Nations. Students will examine the opportunities for applying new technologies like mobile devices, drones, sensors in areas such as agriculture, communications, education, economy, health, governments and gender equality. Students will be able to understand the concepts of social innovation and social entrepreneurship. Students will learn how to apply methodologies for designing solutions that are human-centered and to apply the design thinking methods."),
                                new Course(
                                                "Intelligent Information Systems",
                                                "After completion of the course the student is expected: - to know the techniques and methodologies for development and management of intelligent information systems - to have a knowledge of the techniques for web-mining, sentiment and opinion analysis, recommender systems, personalization and user profiling."),
                                new Course(
                                                "Intelligent systems",
                                                "The goal of the course is to complete the knowledge of students in the field of intelligent systems, starting from pre-processing data to validation of the built system. Students will be able to build an intelligent system from start to finish on real domain specific problems."),
                                new Course(
                                                "Computer Animation",
                                                "After the completion of the course it is expected for students to be capable of using basic methods for productive creation of computer based animations and working with applications for creating animations. They should be able to model, apply textures, rig, add lights, animate, render and compose digital scenes."),
                                new Course(
                                                "Mobile Applications",
                                                "After finishing this course the student is expected to have broadened knowledge in application of technologies and tools for mobile application design and development."),
                                new Course(
                                                "Business process modeling and management",
                                                "After completion of the course, the student is expected to understand and have deeper knowledge of types of business processes and their relationship to information systems, will have deeper knowledge in identification, modeling and mapping various types of business processes, will be able to apply tools and languages for business process modeling through appropriate diagrams, will have knowledge of the principles for improving process flow, will have knowledge of the concepts of data exchange and interoperability."),
                                new Course(
                                                "Modern robotics trends",
                                                "Students will be familiarized with the contemporary robotics trends. They will gain knowledge of the modern techniques for modelling the environment, in which the robots are common, included in every day activities. The students will be acquainted with the robotics trends, such as human – robot interaction, nanorobotics, biologically inspired robots, robots on the genetics level, robotized manufacturing processes, robotics as assistive technology and other modern trends."),
                                new Course(
                                                "Advanced Databases",
                                                "The goal of the course is to introduce the students with the advanced concepts of relational database systems, data modelling, management and maintenance, as well as the development of data centric information systems. Also, the students will acquire strong theoretical and practical knowledge about the novel features and extensions of the relational and non-relational database systems, as well as the contemporary issues in the database systems development."),
                                new Course(
                                                "Non-relational databases",
                                                "The aim of the course is to familiarize students with unstructured and semi-structured data types, their organization and storage, as well as techniques for manipulating and processing them. Students will be also familiar with NoSQL databases, modern databases that don't rely on the relational model, which are used in distributed and clustered environments. Special emphasis will be put on the practical knowledge of some of the available NoSQL databases."),
                                new Course(
                                                "Entrepreneurship",
                                                "Students will be introduced with challenges that will face if they decide to create their own business. They will be able to produce initial market analyses, to define metrics needed to evaluate the success of their business, as well as to know how to recognize whether they have managed to create values for their customers (users). Finally, they will be able to present (pitch) their business or business idea in front of potential clients, partners and investors."),
                                new Course(
                                                "Data Warehouses and OLAP",
                                                "Introduction to organization and manipulation of data organized in data warehouses, as well as basic operations and algorithms for working with data warehouses. The student will be capable to model data warehouses, to organize and manipulate with data stored in data warehouses, to prepare analytic reports based on the same data."),
                                new Course(
                                                "Business statistics",
                                                "Запознавање со основните статистички методи и техники за прикажување, анализа и истражување на податоци."),
                                new Course(
                                                "Fundamentals of information theory",
                                                "Студентите ќе бидат запознати со основите на теорија на веројатност, а потоа и основните поими од теорија на информации и нејзината примена во реални комуникациски системи."),
                                new Course(
                                                "Fundamentals of communication systems",
                                                "Главна цел на предметот е студентите да се запознаат со анализата на комуникациски сигнали и нивниот пренос низ медиум, типовите на модулација и влијанието на шумот врз модулациските техники. Дополнително студентите ќе се здобијат со познавање од софтверски дефинирано радио, современите комуникациски системи и нивниот тековен развој."),
                                new Course(
                                                "Green Computing",
                                                "Студентите ќе стекнат знаење за мерење и пресметување компјутерска моќност и системи за ладење, дизајн на енергетско ефикасни компјутерски системи, процеси, компоненти во насока на ниска потрошувачка на енергија, дизајн на енергетско ефикасни електрични кола, дизајн на енергетски ефикасни компјутерски системи со минимум број на хардверски компоненти, дизајн на еко дата центри, рециклирање на компјутерска опрема, користење на виртиуелизација и интернет решенија во намалување на бројот на протребата од други компјутерски системи, користење на техники за планирање и развој на еко компјутерски технолошки решенија, еко-компјутерски стандарди и регулативи (EnergyStar, RoHS и други), штетно влијание на средината и рециклирање, бизнис процеси за одржлив компјутерски развој на компаниите и други зелени компјутерски технологии, зголемување на еко-свесноста со користење на еко-компјутерски решенија, рециклирање на компјутески компоненти и конструкција на одржливи компјутерски системи, одржливи компјутерски системи за мониторинг анализа во реално време, е-принт во компании, зголемување на бизнис вредноста на компаниите со користење на одржливи и ефикасни компјутерски системи."),
                                new Course(
                                                "Network security",
                                                "Целта на овој курсот е да се покријат принципите за сигурноста кај компјутерските системи и мрежи, при што студентот ќе се запознае со различни техники за напад и одбрана."),
                                new Course(
                                                "Parallel and distributed processing",
                                                "Цел на предметот е студентите да ги совладаат методите на паралелно и дистрибуирано процесирање, можностите за паралелизација на секвенцијална програма, дистрибуирано процесирање на голем број на податоци и проблемите со кои треба да се справат во тој процес"),
                                new Course(
                                                "Network administration",
                                                "По завршувањето на курсот се очекува студентот да ги разбира проблемите на администрацијата со мрежи и да знае да ги применува на методите и алатките за администрација со комуникациски мрежи."),
                                new Course(
                                                "Infrastructure coding",
                                                "Студентот ќе се здобие со знаење за лесно и ефикасно менаџирање на IT системи, управување со традиционалните податочни центри, приватни и јавни облаци и клиентските компјутери и уреди. Студентот ќе може да се запознае и со платформи за менаџирање на повеќе хипервизори, физички ресурси и апликации."),
                                new Course(
                                                "Cryptography",
                                                "Запознавање со основните криптографски принципи и методи; изучување на основните крипто- дизајни; практично користење на изучените криптографски алгоритми."),
                                new Course(
                                                "Distributed systems",
                                                "Предметот има за цел запознавање со развојот на middleware системите. Предмеот ги покрива принципите врз кои се изградени дистрибуираните системи, пред се комуникациите, процесирањето, именување, конзистентност и репликација, справувње со дефекти и безбедност. Овие принципи се понатаму обработени во нивната примена кај дистрибуираните веб базирани системи, дистрибуираните објектно базирани системи, дистрибуираните датотечни системи и дистрибуираните коориднациски системи."),
                                new Course(
                                                "Optical networks",
                                                "Студентот ќе се стекне со основни познавања за дизајн, контрола и управување на оптички мрежи со помош на современите мрежни технологии, како и со некои тековни развои во областа."),
                                new Course(
                                                "Ethical hacking",
                                                "Студентот ќе ги запознае основните концепти, техники и алатки кои се користат во полето на безбедност на системи. Со преземање на улогата на \"напаѓач\" студентот ќе се стекне со знаење за повеќето сигурносни слабости во неговата околина и начин како да се заштити од нив."),
                                new Course(
                                                "Discrete structures",
                                                "Во овој предмет ќе се изучуваат базични математички концепти за компјутерски\n"
                                                                +
                                                                "науки. Студентите ќе се запознаат со основите на множества, исказна и предикатна\n"
                                                                +
                                                                "логика, техники за докажување и булова алгебра."),
                                new Course(
                                                "Discrete structures 2",
                                                "Курсот претставува вовед во основните математички концепти неопходни за\n"
                                                                +
                                                                "повисоките курсеви од компјутерски науки. Ќе се изучуваат напредни техники за\n"
                                                                +
                                                                "докажување, индукција рекурзија. Студентите треба да стекнат вештини за решавање\n"
                                                                +
                                                                "на комбинаторни задачи. Да се запознаат со основната терминологија и основите за\n"
                                                                +
                                                                "претставување на графови."),
                                new Course(
                                                "Measurements and analysis of Internet traffic",
                                                "Цели на предметната програма (компетенции): За инженер кој работи со мрежни технологии е корисно да има познавања од мерење, анализа и моделирање на интернет сообраќајот заради поквалитетно дизајнирање на мрежите како и подобро користење на нивните перформанси. Со овој курс студентите ќе се запознаат со основите на инженерството на комуникациски сообраќај, како и различни техники за анализа, мерење, карактеризација, класификација и предвидување на интернет сообраќај."),
                                new Course(
                                                "Process robotics",
                                                "По завршувањето на предметот студентот се очекува да има основни познавања\n"
                                                                +
                                                                "од водењето на процесите во роботиката, развој на апликации со сензори и\n"
                                                                +
                                                                "актуатори и управување со процеси кои вклучуваат роботи. Студентите ќе се\n"
                                                                +
                                                                "воведат во начините како се програмираат индустриски контролери."),
                                new Course(
                                                "Introduction to time series analysis",
                                                "Запознавање на студентите со анализа на произволни временски серии. Курсот два\n"
                                                                +
                                                                "вовед во типовите на временски серии, покрива стационарни процеси, спектрална\n"
                                                                +
                                                                "анализа на стационарни процеси, ARMA модели, ARIMA и сезонални ARIMA\n"
                                                                +
                                                                "модели, временско-просторни методи. Со знаењето стекнато на курсот студентите ќе\n"
                                                                +
                                                                "може да анализираат временски серии од берзански податоци, да откриваат\n"
                                                                +
                                                                "трендови, да предвидуваат идни појави, како и да ги користат за препознавање на\n"
                                                                +
                                                                "разновидни настани кои се опишани со временски серии."),
                                new Course(
                                                "Modeling and Simulation",
                                                "Студентот ќе се здобие со знаења за користење на техники за моделирање со цел\n"
                                                                +
                                                                "да го евалуира однесувањето на реалните системи. Студентот ќе стекне\n"
                                                                +
                                                                "способност за конструирање, верификација и решавање на модели со различни\n"
                                                                +
                                                                "нивоа на апстракција и деталност. Ќе бидат опфатени и методи за фитување на\n"
                                                                +
                                                                "состојбата и параметрите на моделите со реални податоци, како и предвидување\n"
                                                                +
                                                                "на идното однесување и \"што-ако\" анализи."),
                                new Course(
                                                "Computational biology",
                                                "Целта на курсот е студентите да се запознаат со основите на модерните техники од\n"
                                                                +
                                                                "областа на пресметковна биологија. По завршувањето на курсот кандидатите: ќе\n"
                                                                +
                                                                "имаат продлабочени знаења за напредните технологии и методи за пресметковна\n"
                                                                +
                                                                "биологија, динамички системи и моделирање; ќе можат да разберат, анализираат и\n"
                                                                +
                                                                "формулираат генерални проблеми од областа на пресметковна биологија; ќе можат\n"
                                                                +
                                                                "успешно да применат методи при решавање на реални проблеми; ќе можат да\n"
                                                                +
                                                                "конципираат, анализираат, реализираат и проценат перформанси на методи и модели\n"
                                                                +
                                                                "во пресметковна биологија."),
                                new Course(
                                                "Programming languages and compilers",
                                                "Студентите треба да го разбрерат развојот и спектарот на програмските јазици, и да\n"
                                                                +
                                                                "го сфатат процесот на конструкција на компајлер што ќе ги надгради како\n"
                                                                +
                                                                "програмери кои навлегле во суштината на програмските јазици."),
                                new Course(
                                                "Crowd-sourcing and human computing",
                                                "Целта на предметот е да ги запознае студентите со можностите на толпата да споделува и обработува податоци кои овозможуваат да се решаваат проблеми кои се сеуште комплексни за компјутерските системи, но многу едноставни за колектив со човечка интелигенција. Предметот ќе ги воведе студентите во нов дизајн на апликации и концепт на програмирање кој се заснова на недоверливо учество на голем број поединци од толпата. Во предметот ќе се разгледаат постоечки апликации и платформи за собирање на податоци и решавање на обемни задачи на барање."),
                                new Course(
                                                "IT systems for learning",
                                                "Цели на предметната програма (компетенции): По успешното завршување на овој предмет, студентот ќе биде запознат со еволуцијата на теориите за учење и ќе биде во состојба да ги разбере улогата и новите трендови кај е-околините за учење и да го разбере преминот од традиционалните во е-околините за учење. Студентите ќе се стекнат со способност да понудат соодветни постојни системи за менаџмент со учење и наставни содржини и системи за проверка на знаење на бизнис побарувања, како и да креираат нови иновативни решенија во областа на е-учењето."),
                                new Course(
                                                "Digitization",
                                                "Целта на предметот е да се научат процесот и техниките за дигитизација.\n"
                                                                +
                                                                "Студентите треба да ги совладаат основните принципи за менаџирање со\n"
                                                                +
                                                                "дигитални материјали и нивна презервација, како и техники и технологии за\n"
                                                                +
                                                                "нивно презентрање."));
                if (!courseRepository.existsByTitle("Business and Management")) {
                        courseRepository.saveAll(courses);
                }
//                if (!flashCardRepository.existsByQuestion("Test Question?")) {
//                        List<FlashCard> flashCards = List.of(
//                                new FlashCard("Test Question?", "Test Answer", courseRepository.findById(1L).get()),
//                                new FlashCard("Test Question Again?", "Test Answer Again", courseRepository.findById(1L).get())
//                        );
//                        flashCardRepository.saveAll(flashCards);
//                }
        }

}
