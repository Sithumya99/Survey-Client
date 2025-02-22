import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { Survey } from "../../Classes/survey.class";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { Question } from "../../Classes/question.class";
import { IPieChart } from "../../Interfaces/BasicInterfaces.interface";

@Component({
    selector: 'app-survey-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        NgxChartsModule
    ],
    templateUrl: './survey-dashboard.component.html',
    styleUrl: './survey-dashboard.component.scss'
})

export class SurveyDashboardComponent {
    survey: Survey | undefined;
    
    constructor() {
        BasicdataFacade.getCurrentSurvey$().subscribe(sur => {
            this.survey = sur;
        });
    }

    isCheckbox(question: Question): boolean {
        return question.questionType == 'checkbox';
    }

    isRadio(question: Question): boolean {
        return question.questionType == 'radio';
    }

    isOpen(question: Question): boolean {
        return question.questionType == 'open';
    }

    getOpenAnswers(sectionId: number, questionId: number): string[] {
        let answers: string[] = []

        for (let i = 0; i < this.survey!.responses.length; i++) {
            let res = this.survey!.responses[i];
            let existAnswer = res.answers.find(an => an.sectionId == sectionId && an.questionId == questionId);
            if (existAnswer) {
                answers.push(existAnswer.answer);
            }
        }

        return answers;
    }

    getChartData(sectionId: number, questionId: number): IPieChart[] {
        let pieData: IPieChart[] = [];

        for (let i = 0; i < this.survey!.sections.length; i++) {
            let section = this.survey!.sections[i];
            if (section.sectionId == sectionId) {
                for (let j = 0; j < section.questions.length; j++) {
                    let question = section.questions[j];
                    if (question.questionId == questionId) {
                        for (let op = 0; op < question.options.length; op++) {
                            pieData.push({
                                name: question.options[op].option,
                                value: question.options[op].percentage
                            });
                        }
                        break;
                    }
                }
            }
        }

        return pieData;
    }
}