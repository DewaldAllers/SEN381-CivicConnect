# First use check for NFR-004

Version 1.0 | 15 October 2026 | Owner: Tristan Els | Status: **approved when its pull request merges**

NFR-004 says a new requester can send a request and find its status without help. AC-NFR-004 turns that into a check with five people. This page says how I run it, so each person gets the same instructions and the result means something. It is the design for T-NFR-004-01 in the [test cases](test-cases.md).

The result is first evidence only. Five people do not prove the pages work for everyone, and the RTM says so.

## Who

Five people who have never used CivicConnect and are not on the team. They stand in for members of the public who send a request. I write down who they are by a number and a short note, such as "second year student, uses the council website rarely". I do not use names.

## Before each person

- The server is running from the tagged release candidate with requests in memory, so every person starts from the same empty list. The [demonstration guide](../demo/README.md) says how.
- I sign in as Thandi before the person sits down. The check measures the two tasks and not the sign in, as AC-NFR-004 asks for a prepared session.
- The browser is on the requester page.
- I do not explain the pages. I answer questions about the task wording and nothing else.

## The two tasks

I read these aloud and hand over a card with the same words.

1. Send a request to the council. The title is "Broken light in the car park". The description is "The light near the second row has not worked for a week." The category is Maintenance.
2. Find out what has happened to your request so far.

## Timing

I start the timer when I finish reading the instructions. I stop it when the person has completed both tasks. A task is complete when the request is sent and the person can say its current status out loud. The limit is five minutes for the two tasks together.

## What I record for each person

| What | How |
| --- | --- |
| Person | The number and the short note |
| Completed both tasks | Yes or no |
| Time | Minutes and seconds from the start to the end of the second task |
| Help given | Anything I said or pointed at after the instructions, written as it happened |
| What went wrong | Where the person hesitated, clicked the wrong thing or misread a label |

## Pass rule

At least four of the five people complete both tasks, without help, in under five minutes each. A person who needed help counts as not completing.

## After the check

I write the five results in the RTM evidence cell for NFR-004 and in the release summary, with the date, and I mark T-NFR-004-01 Passed or Failed. If the rule is not met, I raise a defect for each thing that went wrong and the release summary names NFR-004 as a limitation. The target stays a proposal under DEC-010. If the result shows the number is wrong, that is a change request and not a quiet edit.

I do not make up people or results, and I do not rerun the check with the same people to improve the numbers.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 15 (quality engineering and evidence standard, p. 14).

Full source records are in the [source register](../sources.md).
