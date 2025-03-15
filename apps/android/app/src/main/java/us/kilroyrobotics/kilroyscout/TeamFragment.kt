package us.kilroyrobotics.kilroyscout
import android.annotation.SuppressLint
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.CheckBox
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.MutableLiveData
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.textfield.MaterialAutoCompleteTextView
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout

class TeamFragment(private val team: EventData.Team, private val eventData: MutableLiveData<EventData?>, private val supportFragmentManager: FragmentManager) : Fragment(R.layout.fragment_team) {
    private var prescoutingData = team.scouting.copy()
    private var savebar: Snackbar? = null

    @SuppressLint("SetTextI18n")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_team, container, false)

        val teamIdentifier: TextView = view.findViewById(R.id.teamIdentifier)
        teamIdentifier.text = "${team.teamNumber} • ${team.name}"

        val robotNameRookieYear: TextView = view.findViewById(R.id.robotNameRookieYear)
        robotNameRookieYear.text = "Robot Name: ${if (team.robotName == "") "N/A" else team.robotName} • Rookie Year: ${team.rookieYear}"

        val drivetrain: TextInputLayout = view.findViewById(R.id.drivetrain)
        val drivetrainItems = arrayOf("Swerve", "Mecanum", "Tank", "Other")
        val drivetrainAdapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_dropdown_item, drivetrainItems)
        val drivetrainEditText = drivetrain.editText as? MaterialAutoCompleteTextView
        drivetrainEditText?.setAdapter(drivetrainAdapter)
        drivetrainEditText?.threshold = Integer.MAX_VALUE
        drivetrainEditText?.setText(prescoutingData.drivetrain)
        drivetrainEditText?.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                // Called *before* the text is changed.  Useful for tracking changes.
                // 's' is the current text
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                // Called *during* the text change.  Also useful for tracking changes.
                // 's' is the current text
            }

            override fun afterTextChanged(s: Editable?) {
                prescoutingData = prescoutingData.copy(drivetrain = s.toString().lowercase())
                runSaveCheck(view)
            }
        })

        val programmingLanguage: TextInputLayout = view.findViewById(R.id.programmingLanguage)
        val programmingLanguageItems = arrayOf("Java", "Kotlin (Java based)", "C++", "Python")
        val programmingLanguageAdapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_dropdown_item, programmingLanguageItems)
        val programmingLanguageEditText = programmingLanguage.editText as? MaterialAutoCompleteTextView
        programmingLanguageEditText?.setAdapter(programmingLanguageAdapter)
        programmingLanguageEditText?.threshold = Integer.MAX_VALUE
        programmingLanguageEditText?.setText(prescoutingData.programmingLanguage)
        programmingLanguageEditText?.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                // Called *before* the text is changed.  Useful for tracking changes.
                // 's' is the current text
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                // Called *during* the text change.  Also useful for tracking changes.
                // 's' is the current text
            }

            override fun afterTextChanged(s: Editable?) {
                var value = s.toString().lowercase()
                if (value == "c++") value = "cpp"
                if (value == "kotlin (java based)") value = "kotlin"

                prescoutingData = prescoutingData.copy(programmingLanguage = value)
                runSaveCheck(view)
            }
        })

        val canScoreCoral: CheckBox = view.findViewById(R.id.canScoreCoral)
        canScoreCoral.isChecked = prescoutingData.canScoreCoral
        canScoreCoral.setOnCheckedChangeListener { _, state ->
            prescoutingData = prescoutingData.copy(canScoreCoral = state)
            runSaveCheck(view)
        }

        val canRemoveAlgae: CheckBox = view.findViewById(R.id.canRemoveAlgae)
        canRemoveAlgae.isChecked = prescoutingData.canRemoveAlgae
        canRemoveAlgae.setOnCheckedChangeListener { _, state ->
            prescoutingData = prescoutingData.copy(canRemoveAlgae = state)
            runSaveCheck(view)
        }

        val canScoreAlgae: CheckBox = view.findViewById(R.id.canScoreAlgae)
        canScoreAlgae.isChecked = prescoutingData.canScoreAlgae
        canScoreAlgae.setOnCheckedChangeListener { _, state ->
            prescoutingData = prescoutingData.copy(canScoreAlgae = state)
            runSaveCheck(view)
        }

        val maxCoralScoringLevelAmount: TextView = view.findViewById(R.id.maxCoralScoringLevelAmount)
        maxCoralScoringLevelAmount.text = prescoutingData.maxCoralScoringLevel.toString()
        val maxCoralScoringLevelAdd: Button = view.findViewById(R.id.maxCoralScoringLevelAdd)
        maxCoralScoringLevelAdd.setOnClickListener {
            if (prescoutingData.maxCoralScoringLevel < 4u) {
                prescoutingData = prescoutingData.copy(maxCoralScoringLevel = prescoutingData.maxCoralScoringLevel + 1u)
                maxCoralScoringLevelAmount.text = prescoutingData.maxCoralScoringLevel.toString()
                runSaveCheck(view)
            }
        }
        val maxCoralScoringLevelRemove: Button = view.findViewById(R.id.maxCoralScoringLevelRemove)
        maxCoralScoringLevelRemove.setOnClickListener {
            if (prescoutingData.maxCoralScoringLevel > 0u) {
                prescoutingData = prescoutingData.copy(maxCoralScoringLevel = prescoutingData.maxCoralScoringLevel - 1u)
                maxCoralScoringLevelAmount.text = prescoutingData.maxCoralScoringLevel.toString()
                runSaveCheck(view)
            }
        }

        val averageCoralCycledAmount: TextView = view.findViewById(R.id.averageCoralCycledAmount)
        averageCoralCycledAmount.text = prescoutingData.averageCoralCycled.toString()
        val averageCoralCycledAdd: Button = view.findViewById(R.id.averageCoralCycledAdd)
        averageCoralCycledAdd.setOnClickListener {
            prescoutingData = prescoutingData.copy(averageCoralCycled = prescoutingData.averageCoralCycled + 1u)
            averageCoralCycledAmount.text = prescoutingData.averageCoralCycled.toString()
            runSaveCheck(view)
        }
        val averageCoralCycledRemove: Button = view.findViewById(R.id.averageCoralCycledRemove)
        averageCoralCycledRemove.setOnClickListener {
            if (prescoutingData.averageCoralCycled > 0u) {
                prescoutingData = prescoutingData.copy(averageCoralCycled = prescoutingData.averageCoralCycled - 1u)
                averageCoralCycledAmount.text = prescoutingData.averageCoralCycled.toString()
                runSaveCheck(view)
            }
        }

        val mostCoralCycledAmount: TextView = view.findViewById(R.id.mostCoralCycledAmount)
        mostCoralCycledAmount.text = prescoutingData.mostCoralCycled.toString()
        val mostCoralCycledAdd: Button = view.findViewById(R.id.mostCoralCycledAdd)
        mostCoralCycledAdd.setOnClickListener {
            prescoutingData = prescoutingData.copy(mostCoralCycled = prescoutingData.mostCoralCycled + 1u)
            mostCoralCycledAmount.text = prescoutingData.mostCoralCycled.toString()
            runSaveCheck(view)
        }
        val mostCoralCycledRemove: Button = view.findViewById(R.id.mostCoralCycledRemove)
        mostCoralCycledRemove.setOnClickListener {
            if (prescoutingData.mostCoralCycled > 0u) {
                prescoutingData = prescoutingData.copy(mostCoralCycled = prescoutingData.mostCoralCycled - 1u)
                mostCoralCycledAmount.text = prescoutingData.mostCoralCycled.toString()
                runSaveCheck(view)
            }
        }

        val maxCoralCycledInAutoAmount: TextView = view.findViewById(R.id.maxCoralCycledInAutoAmount)
        maxCoralCycledInAutoAmount.text = prescoutingData.maxCoralScoredInAuto.toString()
        val maxCoralCycledInAutoAdd: Button = view.findViewById(R.id.maxCoralCycledInAutoAdd)
        maxCoralCycledInAutoAdd.setOnClickListener {
            prescoutingData = prescoutingData.copy(maxCoralScoredInAuto = prescoutingData.maxCoralScoredInAuto + 1u)
            maxCoralCycledInAutoAmount.text = prescoutingData.maxCoralScoredInAuto.toString()
            runSaveCheck(view)
        }
        val maxCoralCycledInAutoRemove: Button = view.findViewById(R.id.maxCoralCycledInAutoRemove)
        maxCoralCycledInAutoRemove.setOnClickListener {
            if (prescoutingData.maxCoralScoredInAuto > 0u) {
                prescoutingData = prescoutingData.copy(maxCoralScoredInAuto = prescoutingData.maxCoralScoredInAuto - 1u)
                maxCoralCycledInAutoAmount.text = prescoutingData.maxCoralScoredInAuto.toString()
                runSaveCheck(view)
            }
        }

        val canScoreCoralInAuto: CheckBox = view.findViewById(R.id.canScoreCoralInAuto)
        canScoreCoralInAuto.isChecked = prescoutingData.canScoreCoralInAuto
        canScoreCoralInAuto.setOnCheckedChangeListener { _, state ->
            prescoutingData = prescoutingData.copy(canScoreCoralInAuto = state)
            runSaveCheck(view)
        }

        val canRemoveAlgaeInAuto: CheckBox = view.findViewById(R.id.canRemoveAlgaeInAuto)
        canRemoveAlgaeInAuto.isChecked = prescoutingData.canRemoveAlgaeInAuto
        canRemoveAlgaeInAuto.setOnCheckedChangeListener { _, state ->
            prescoutingData = prescoutingData.copy(canRemoveAlgaeInAuto = state)
            runSaveCheck(view)
        }

        val canScoreAlgaeInAuto: CheckBox = view.findViewById(R.id.canScoreAlgaeInAuto)
        canScoreAlgaeInAuto.isChecked = prescoutingData.canScoreAlgaeInAuto
        canScoreAlgaeInAuto.setOnCheckedChangeListener { _, state ->
            prescoutingData = prescoutingData.copy(canScoreAlgaeInAuto = state)
            runSaveCheck(view)
        }

        val canLeaveInAuto: CheckBox = view.findViewById(R.id.canLeaveInAuto)
        canLeaveInAuto.isChecked = prescoutingData.canLeaveInAuto
        canLeaveInAuto.setOnCheckedChangeListener { _, state ->
            prescoutingData = prescoutingData.copy(canLeaveInAuto = state)
            runSaveCheck(view)
        }

        val canShallowCageClimb: CheckBox = view.findViewById(R.id.canShallowCageClimb)
        canShallowCageClimb.isChecked = prescoutingData.canShallowCageClimb
        canShallowCageClimb.setOnCheckedChangeListener { _, state ->
            prescoutingData = prescoutingData.copy(canShallowCageClimb = state)
            runSaveCheck(view)
        }

        val canDeepCageClimb: CheckBox = view.findViewById(R.id.canDeepCageClimb)
        canDeepCageClimb.isChecked = prescoutingData.canDeepCageClimb
        canDeepCageClimb.setOnCheckedChangeListener { _, state ->
            prescoutingData = prescoutingData.copy(canDeepCageClimb = state)
            runSaveCheck(view)
        }

        val comments: TextInputEditText = view.findViewById(R.id.comments)
        comments.setText(prescoutingData.comments)
        comments.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                // Called *before* the text is changed.  Useful for tracking changes.
                // 's' is the current text
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                // Called *during* the text change.  Also useful for tracking changes.
                // 's' is the current text
            }

            override fun afterTextChanged(s: Editable?) {
                prescoutingData = prescoutingData.copy(comments = s.toString())
                runSaveCheck(view)
            }
        })

        return view
    }

    override fun onDestroyView() {
        super.onDestroyView()
        savebar?.dismiss()
    }

    private fun runSaveCheck(view: View) {
        if (prescoutingData != team.scouting) {
            savebar = Snackbar.make(view, R.string.savebar_message, Snackbar.LENGTH_INDEFINITE)
                .setAction(R.string.savebar_save) {
                    MaterialAlertDialogBuilder(requireContext())
                        .setTitle(resources.getString(R.string.event_dialog_title))
                        .setMessage(resources.getString(R.string.savebar_dialog_message))
                        .setNegativeButton(resources.getString(R.string.event_dialog_cancel)) { _, _ ->
                            val currentTeamData = eventData.value!!.teams.find { t -> t.teamNumber == team.teamNumber }

                            supportFragmentManager.beginTransaction()
                                .replace(R.id.nav_host_fragment, TeamFragment(currentTeamData!!, eventData, supportFragmentManager))
                                .commitNow()
                        }
                        .setPositiveButton(resources.getString(R.string.event_dialog_continue)) { _, _ ->
                            prescoutingData.recentlyModified = true
                            prescoutingData.modified = true
                            val updatedTeams = eventData.value!!.teams.map { if (it.teamNumber == team.teamNumber) team.copy(scouting = prescoutingData) else it }

                            eventData.value = eventData.value!!.copy(teams = updatedTeams.toTypedArray())
                            Toast.makeText(context, "Saved Team Data for ${team.teamNumber}", Toast.LENGTH_SHORT).show()
                        }
                        .show()
                }
                .addCallback(object : Snackbar.Callback() {
                    override fun onDismissed(snackbar: Snackbar, event: Int) {
                        if (event == DISMISS_EVENT_SWIPE) {
                            val currentTeamData = eventData.value!!.teams.find { t -> t.teamNumber == team.teamNumber }

                            supportFragmentManager.beginTransaction()
                                .replace(R.id.nav_host_fragment, TeamFragment(currentTeamData!!, eventData, supportFragmentManager))
                                .commitNow()
                        }
                    }
                })

            savebar!!.show()
        } else {
            savebar?.dismiss()
        }
    }
}
