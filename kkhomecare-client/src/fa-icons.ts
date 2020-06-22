import {
  faBroom,
  faBrush,
  faChessBoard,
  faPaintRoller,
  faTree,
  faBirthdayCake,
  faSun,
  faAngleLeft,
  faAngleRight,
  faSpinner,
  faCheckCircle,
  faDollarSign,
  faEnvelope,
  faUpload,
  faImages,
  faFileInvoiceDollar,
  faTrash,
  faEye,
  faPhone,
  faExclamationCircle,
  faEdit,
  faReply,
  faEyeSlash,
  faTimes,
  faPlus,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faInstagram,
  faFacebookF
} from '@fortawesome/free-brands-svg-icons';
import {
  faCopyright
} from '@fortawesome/free-regular-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

export class FaIconsComponent {
  constructor() { }
  public static init(library: FaIconLibrary) {
    library.addIcons(
      faBroom,
      faFacebook,
      faBrush,
      faChessBoard,
      faPaintRoller,
      faTree,
      faCopyright,
      faBirthdayCake,
      faSun,
      faAngleRight,
      faAngleLeft,
      faInstagram,
      faFacebookF,
      faSpinner,
      faCheckCircle,
      faDollarSign,
      faEnvelope,
      faUpload,
      faImages,
      faFileInvoiceDollar,
      faTrash,
      faEye,
      faPhone,
      faExclamationCircle,
      faEdit,
      faReply,
      faEyeSlash,
      faTimes,
      faPlus,
      faPaperPlane
    );
  }
}
