# First use check for NFR-004

Version 1.1 | 16 October 2026 | Owner: Tristan Els | Status: **approved when its pull request merges**

NFR-004 says a new requester can send a request and find its status without help. AC-NFR-004 turns that into a check with five people. This page says how I run it, so each person gets the same instructions and the result means something. It is the design for T-NFR-004-01 in the [test cases](test-cases.md).

The result is first evidence only. Five people do not prove the pages work for everyone, and the RTM says so.

## Who

Five people who have never used CivicConnect and are not on the team. Family and friends are fine, as long as they have not seen the pages and I have not shown them how it works. People who know me are not a random sample of the public, and they may go easier on me than a stranger would. The result says so.

I write each person down by a number, P1 to P5, with a short note such as "adult, uses the council website rarely". I do not write names in the repository, and I do not publish photos.

Each person agrees before we start that I may time them, write down what happened and record their screen. I tell them the check is of the pages and not of them, and they can stop at any time.

## Before each person

- The server is running from the tagged release candidate with requests in memory. I stop it and start it again before each person, so every person starts from an empty list. The [demonstration guide](../demo/README.md) says how.
- I sign in as Thandi before the person sits down. The check measures the two tasks and not the sign in, as AC-NFR-004 asks for a prepared session.
- The browser is on the requester page, and a screen recording is running.
- I do not explain the pages. I answer questions about the task wording and nothing else. If someone asks how to do something, I say "do what you would normally do". If I help in any other way, I write down exactly what I said and the person counts as not completing.

## The two tasks

I read these aloud and hand over a card with the same words.

1. Send a request to the council. The title is "Broken light in the car park". The description is "The light near the second row has not worked for a week." The category is Maintenance.
2. Find out what has happened to your request so far.

## Timing

I start the timer when I finish reading the instructions. I stop it when the person has completed both tasks. A task is complete when the request is sent and the person can say its current status out loud. The limit is five minutes for the two tasks together.

## What I record for each person

I write this down during the session, on paper or in a note on my phone, and I do not change it afterwards.

| What | How |
| --- | --- |
| Person | The number and the short note |
| Date and time | When the session started |
| Completed both tasks | Yes or no |
| Time | Minutes and seconds from the start to the end of the second task |
| Help given | Anything I said or pointed at after the instructions, written as it happened |
| What went wrong | Where the person hesitated, clicked the wrong thing or misread a label |
| The request they sent | Its reference and the time it was sent, read from the page at the end of the session |

## Pass rule

At least four of the five people complete both tasks, without help, in under five minutes each. A person who needed help counts as not completing.

## The evidence I keep

The assessor will not assume the check took place, so each session leaves something that can be looked at.

| Evidence | Where it lives |
| --- | --- |
| The written record for each person, as I wrote it during the session | A private folder. I keep the originals |
| The screen recording of each session, with the timer visible or the clock on screen | A private folder, with the person's agreement. I do not publish it, and I can show a short clip in the video if the person agrees |
| The request each person sent, shown on the requester page at the end with its reference and time | In the screen recording |
| The results table, with P1 to P5, the times, who completed, and the help given | In the repository, in `docs/testing/nfr-004-results.md`, after the check |
| The RTM evidence cell and the release summary row for NFR-004, with the date | In the repository |

The video shows the results page and says what the check proves and what it does not. It does not show faces or names of the people who took part.

## If I cannot find five people in time

I run the check with as many people as I can and write down how many ran. The pass rule needs four of five, so with fewer than five the result reads "not verified" for NFR-004, with the number of people who ran and what they did. I do not fill the gap, I do not use team members, and I do not run the check with the same person twice.

## After the check

I write the results in the repository, in the RTM evidence cell for NFR-004 and in the release summary, with the date, and I mark T-NFR-004-01 Passed or Failed. If the rule is not met, I raise a defect for each thing that went wrong and the release summary names NFR-004 as a limitation. The target stays a proposal under DEC-010. If the result shows the number is wrong, that is a change request and not a quiet edit.

I do not make up people or results.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 15 (quality engineering and evidence standard, p. 14).

Full source records are in the [source register](../sources.md).
