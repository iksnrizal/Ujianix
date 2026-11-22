import QtQuick 2.0;
import calamares.slideshow 1.0;

Presentation {
    id: presentation

    Slide {
        Image {
            id: logo
            source: "ujianik.png"
            width: 140; height: 140
            fillMode: Image.PreserveAspectFit
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.verticalCenter: parent.verticalCenter
            anchors.verticalCenterOffset: -50
        }
        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.top: logo.bottom
            anchors.topMargin: 24
            width: 520
            text: "Ujianix sedang dipasang.<br/>Proses ini biasanya selesai dalam beberapa menit."
            wrapMode: Text.WordWrap
            horizontalAlignment: Text.AlignHCenter
            color: "#263238"
            font.pixelSize: 16
        }
    }
}
