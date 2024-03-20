import showModal from "discourse/lib/show-modal";
import { eventLabel } from "../lib/date-utilities";
import { default as discourseComputed } from "discourse-common/utils/decorators";
import Component from "@ember/component";
import { inject as service } from "@ember/service";
import AddEventModal from "./modal/add-event";
import { action } from "@ember/object";

export default class extends Component {
  @service modal;

  didInsertElement() {
    $(".title-and-category").toggleClass(
      "event-add-no-text",
      this.get("iconOnly"),
    );
  }

  @discourseComputed("noText")
  valueClasses(noText) {
    let classes = "add-event";
    if (noText) {
      classes += " btn-primary";
    }
    return classes;
  }

  @discourseComputed("event")
  valueLabel(event) {
    return eventLabel(event, {
      noText: this.get("noText"),
      useEventTimezone: true,
      showRsvp: true,
      siteSettings: this.siteSettings,
    });
  }

  @discourseComputed("category", "noText")
  iconOnly(category, noText) {
    return (
      noText ||
      this.siteSettings.events_event_label_no_text ||
      Boolean(
        category && category.get("custom_fields.events_event_label_no_text"),
      )
    );
  }
  @action
  showAddEvent() {
    this.modal.show(AddEventModal, {
      model: {
        bufferedEvent: this.event,
        event: this.event,
        update: (event) => {
          this.set("event", event);
        },
      },
    });
  }
  @action
  removeEvent() {
    this.set("event", null);
  }
}
