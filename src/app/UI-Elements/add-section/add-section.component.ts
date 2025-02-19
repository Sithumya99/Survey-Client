import { Component, Input } from "@angular/core";
import { Section } from "../../Classes/section.class";
import { CommonModule } from "@angular/common";
import { Question } from "../../Classes/question.class";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";

@Component({
    selector: 'app-add-section',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './add-section.component.html'
})

export class AddSectionComponent {
    @Input()
    section: Section | undefined;

    removeQuestion(index: number) {
        this.section!.questions.splice(index, 1);
    }

    addQuestion(type: string) {
        BasicdataFacade.addQuestion(this.section!, type);
    }

    removeOption(question: Question, index: number) {
        question.options.splice(index, 1);
    }

    addOption(question: Question) {
        question.options.push({
            option: "",
            percentage: 0
        });
    }

    saveChanges(event: Event, field: string, index?: number) {
        let value = (event.target as HTMLInputElement).value;
        this.section!.setValues(value, field, index);
    }

    setOption(event: Event, question: Question, index: number) {
        let value = (event.target as HTMLInputElement).value;
        question.options[index].option = value;
    }
}