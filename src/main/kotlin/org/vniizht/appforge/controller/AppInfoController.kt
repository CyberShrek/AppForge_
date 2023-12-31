package org.vniizht.appforge.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.ResponseBody
import org.vniizht.appforge.model.AppInfo
import org.vniizht.prilinfo.PrilInfoRemote
import javax.naming.InitialContext

@Controller
class AppInfoController {

    private val prilInfoRemote = InitialContext()
        .lookup("global/prilinfo-1.0/PrilInfo!org.vniizht.prilinfo.PrilInfoRemote") as PrilInfoRemote

    @GetMapping("/manual")
    fun getManual() = "manual.md"

    @GetMapping("/info")
    @ResponseBody
    fun getApplicationInfo(@RequestHeader(required = true, name = "Code") code: String): AppInfo {
        val prilInfo = prilInfoRemote.info(code)

        fun find(key: String) = (prilInfo[key] ?: "") as String
        fun findAll(key: String) = (prilInfo[key] ?: arrayOf("")) as Array<String>

        return AppInfo (
            name              = find("zadname"),
            groupName         = find("zadnameV"),
            path              = find("comstr"),
            groupPath         = find("comstrV"),
            version           = find("version"),
            releaseDate       = find("datan"),
            updateDate        = find("dataupd"),
            technologistName  = find("fio"),
            technologistPhone = find("tel"),
            technologistMail  = find("email"),
            helpPath          = find("helpstr"),
            comment           = find("comment"),
            tables            = findAll("pril_tables"),
            instructionPath   = find("helpstr")
        )
    }
}